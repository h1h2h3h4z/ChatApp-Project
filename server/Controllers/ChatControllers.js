const db = require("../dbConnect");
const createChat = async (req, res) => {
  const { firstId, secondId} = req.body;
 
  try {
    const selectQuery = `
        SELECT * FROM chatApp.chat 
        WHERE (firstuser = ? AND seconduser = ?) or (firstuser = ? AND seconduser = ?)
    `;
    const [result] = await db
      .promise()
      .query(selectQuery, [firstId, secondId, secondId, firstId]);
    if (result.length > 0) {
      // Chat already exists
      return res
        .status(200)
        .json({ message: "Chat already exists", chat: result[0] });
    } else {
      const insertQuery =
        "INSERT INTO chatApp.chat (firstuser, seconduser) VALUES (?, ?)";
      const [insert] = await db
        .promise()
        .query(insertQuery, [firstId, secondId]);
      if (insert && insert.insertId) {
        const selectQuery = "SELECT * FROM chatApp.chat WHERE (firstuser = ? AND seconduser = ?) or (firstuser = ? AND seconduser = ?)";
        const [result] = await db
          .promise()
          .query(selectQuery, [firstId, secondId, secondId, firstId]);
          if (result.length > 0) {
            return res.status(201).json({
              chat_id: result[0].chat_id,
              members: {
                firstuser: result[0].firstuser,
                seconduser: result[0].seconduser,
              },
              createdAt: result[0].createdAt,
              updatedAt: result[0].updatedAt,
            });
          }
      } else {
        res.status(400).json("Error inserting chat");
      }
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};
const findUserChat = async (req, res) => {
  const { userid } = req.params;
  const query = `
          SELECT * FROM chatApp.chat 
          WHERE firstuser = ? OR seconduser = ?
      `;

  try {
    const [result] = await db.promise().query(query, [userid, userid]); // ✅ Await the query
    const results = result.map((result) => {
      return {
        chat_id: result.chat_id,
        members: {
          firstuser: result.firstuser,
          seconduser: result.seconduser,
        },
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
const findChat = (req, res) => {
  const { firstid, secondid } = req.params;
  const query = `
        SELECT * FROM chatApp.chat 
        WHERE (firstuser = ? AND seconduser = ?) 
   OR (firstuser = ? AND seconduser = ?)

    `;
  db.query(query, [firstid, secondid, secondid, firstid], (err, result) => {
    if (err) {
      return res.status(500).json("Server error" + err);
    }
    res.status(200).json({
      chat_id: result[0].chat_id,
      members: {
        firstuser: result[0].firstuser,
        seconduser: result[0].seconduser,
      },
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    });
  });
};
module.exports = { createChat, findUserChat, findChat };
// Compare this snippet from server/Controllers/ChatControllers.js:
