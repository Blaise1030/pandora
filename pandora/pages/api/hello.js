// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const socket = io('http://localhost:3001');

socket.on('chat-message', data => {
    console.log(data);
})


// export default (req, res) => {
//   res.statusCode = 200
//   res.json({ name: 'John Doe' })
// }
