import fetch from 'node-fetch';

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  const { question } = req.body;
  if(!question) return res.status(400).json({error:'Question required'});

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages:[{role:'user', content: question}]
      })
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices[0].message.content });
  } catch(err){
    console.error(err);
    res.status(500).json({ answer:'Error connecting to OpenAI.' });
  }
}
