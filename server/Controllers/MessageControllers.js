const db = require("../dbConnect");

const createMessage = async (req, res) => {
  const { chatid, senderid,recieverid, text } = req.body;
  const query = "INSERT INTO chatApp.messages (chat_id, senderid,recieverid, text) VALUES (?, ?,?, ?)";
  try {
    const [result] = await db.promise().query(query, [chatid, senderid,recieverid, text]);

    if (result.affectedRows > 0) {
      const [newMessage] = await db.promise().query("SELECT * FROM chatApp.messages WHERE chat_id = ?", [chatid]);
    
      
      return res.status(201).json(newMessage);
    } else {
      return res.status(400).json({ message: "Error inserting message" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getMessages = async (req, res) => {
  const { chatid } = req.params;
  try {
    const query = "SELECT * FROM chatApp.messages WHERE chat_id = ?";
    const [result] = await db.promise().query(query, [chatid]);
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = { createMessage, getMessages };
