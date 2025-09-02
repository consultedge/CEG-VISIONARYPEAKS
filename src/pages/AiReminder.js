import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { PlayArrow, Stop } from "@mui/icons-material";
import { customerAPI, callAPI, apiClient } from "../config/api-updated";

const AiReminder = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    totalDue: "",
    emiAmount: "",
    dueDate: "",
  });

  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const apiBaseUrl = process.env.REACT_APP_API_URL || "";

  const showError = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addChatMessage = (msg, fromAI = false) => {
    setChatMessages((prev) => [...prev, { text: msg, fromAI }]);
  };

  const synthesizeSpeech = async (text) => {
    try {
      const res = await apiClient.post("/api/polly/synthesize", { text });
      if (res && res.audioUrl) {
        setAudioUrl(res.audioUrl);
      }
    } catch (err) {
      console.error("Speech synthesis error:", err);
      showError("Failed to synthesize speech");
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showError("Audio recording not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleAudioUpload(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      showError("Failed to start audio recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setLoading(true);
    try {
      // Upload audio and get transcription
      const formData = new FormData();
      formData.append("file", audioBlob);

      const res = await fetch(`${apiBaseUrl}/api/transcribe/audio`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Transcription failed: ${res.statusText}`);
      }

      const data = await res.json();
      if (data && data.transcription) {
        addChatMessage(data.transcription, false);
        await sendChatMessage(data.transcription);
      } else {
        showError("No transcription received");
      }
    } catch (err) {
      console.error("Audio upload error:", err);
      showError("Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.statusText}`);
      }

      const data = await res.json();
      if (data && data.response) {
        addChatMessage(data.response, true);
        await synthesizeSpeech(data.response);
        playAudio();
      } else {
        showError("No response from AI");
      }
    } catch (err) {
      console.error("Chat error:", err);
      showError("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setChatMessages([]);
    setLoading(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.phone ||
      !formData.totalDue ||
      !formData.emiAmount ||
      !formData.dueDate
    ) {
      showError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      // Save client details
      const clientPayload = {
        name: formData.name,
        phone: formData.phone,
        totalDue: formData.totalDue,
        emiAmount: formData.emiAmount,
        dueDate: formData.dueDate,
      };

      const clientRes = await fetch(`${apiBaseUrl}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientPayload),
      });

      if (!clientRes.ok) {
        throw new Error(`Failed to save client: ${clientRes.statusText}`);
      }

      const clientData = await clientRes.json();

      // Start chat conversation
      addChatMessage("Starting AI conversation...", true);
      await sendChatMessage("Hello");

    } catch (err) {
      console.error("Error starting AI call:", err);
      showError(err.message || "Failed to start AI call");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: "16px" }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold" }}
        >
          Client Information
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Enter client details for EMI reminder call
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Client Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Mobile Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Total Due Amount (₹)"
            name="totalDue"
            value={formData.totalDue}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="EMI Amount (₹)"
            name="emiAmount"
            value={formData.emiAmount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.5, borderRadius: "10px" }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Calling...
              </>
            ) : (
              "Start AI Call"
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Chat
          </Typography>
          <Paper
            variant="outlined"
            sx={{ maxHeight: 300, overflowY: "auto", p: 2, borderRadius: "10px" }}
          >
            <List>
              {chatMessages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent: msg.fromAI ? "flex-start" : "flex-end",
                    textAlign: msg.fromAI ? "left" : "right",
                  }}
                >
                  <ListItemText
                    primary={msg.text}
                    sx={{
                      bgcolor: msg.fromAI ? "grey.300" : "primary.main",
                      color: msg.fromAI ? "black" : "white",
                      borderRadius: 2,
                      p: 1,
                      maxWidth: "75%",
                      wordBreak: "break-word",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          {!recording ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PlayArrow />}
              onClick={startRecording}
              disabled={loading}
            >
              Start Speaking
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={stopRecording}
            >
              Stop Speaking
            </Button>
          )}
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={snackbarMsg}
        />
      </Paper>
    </Container>
  );
};

export default AiReminder;
