# Human-like Conversational Chatbot

## Objective  
Design and implement a **human-like conversational chatbot agent** that can be embedded into consumer-facing applications such as social platforms or user-generated content (UGC) platforms.  

Unlike a basic Q&A bot, this chatbot demonstrates:  
- **Empathy**  
- **Contextual Awareness**  
- **Memory**  
- **Scalability**  

---

## Tech Stack  

- **MongoDB** → Database (session persistence & history)  
- **Node.js** → Runtime environment  
- **Express.js** → Backend framework  
- **React** → Frontend  
- **Google Gemini API** → Conversational AI engine  

---

## Key Features  

- **Contextual Awareness** → Remembers conversation history across sessions  
- **Empathy** → Adapts tone via **Context Prompting**  
- **Memory** → Session persistence using MongoDB  
- **Scalability** → Supports multiple users and sessions efficiently  

---

## Project Architecture  

<img width="1085" height="611" alt="Screenshot 2025-08-22 at 2 50 12 AM" src="https://github.com/user-attachments/assets/8e7b893b-608a-4eda-ad60-beeb0d2df838" />

```plaintext
Frontend (React)
        │
        ▼
Backend (Node.js + Express)
        │
        ▼
Database (MongoDB) ←→ Google Gemini API
