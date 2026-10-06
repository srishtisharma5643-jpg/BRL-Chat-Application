const express = require("express");
const Conversation = require("../models/conversation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE OR GET EXISTING CONVERSATION
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { participantId } = req.body;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: "Participant ID is required"
            });
        }

        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            participants: {
                $all: [req.user.userId, participantId]
            }
        });

        // If conversation already exists
        if (existingConversation) {
            return res.status(200).json({
                success: true,
                message: "Conversation already exists",
                conversation: existingConversation
            });
        }

        // Create new conversation
        const conversation = await Conversation.create({
            participants: [req.user.userId, participantId]
        });

        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// GET MY CONVERSATIONS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.userId
        });

        res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


module.exports = router;