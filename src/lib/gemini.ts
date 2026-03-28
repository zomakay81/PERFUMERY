
export async function getAIChatResponse(history: { role: string, parts: { text: string }[] }[], context: any) {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : "") || "";

  if (!apiKey) {
    return "Errore: API Key non configurata. Inserisci la tua VITE_GEMINI_API_KEY nel file .env";
  }

  try {
      const { GoogleGenerativeAI } = await import("@google/genai");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `Sei ESSENZA AI, l'assistente virtuale avanzato del laboratorio di profumeria "ESSENZA".
        Il tuo compito è assistere l'utente nella gestione del laboratorio, analizzando i dati di magazzino, produzione e fornitori.

        CARATTERISTICHE:
        - Sei professionale, tecnico (esperto in profumeria e chimica), ma anche d'ispirazione e visionario.
        - Parli in Italiano.
        - Hai accesso ai dati in tempo reale del laboratorio (che ti verranno passati nel contesto).
        - Prendi iniziativa: se noti scorte basse, ritardi nelle macerazioni o opportunità di ottimizzazione, segnalalo.
        - Puoi suggerire formule, varianti di fragranze e calcolare allergeni (simulati).

        FORMATO RISPOSTE:
        - Usa il Markdown per formattare le risposte.
        - Sii conciso ma esaustivo.
        - Usa emoji legate al mondo della profumeria (🧪, ⚗️, 🌸, 🪵, 🧴).`,
      });

      const chat = model.startChat({
        history,
      });

      const prompt = `CONTESTO ATTUALE LABORATORIO:
      ${JSON.stringify(context, null, 2)}

      Rispondi alla richiesta dell'utente considerando i dati sopra riportati. Se l'utente non fa domande specifiche, analizza i dati e fornisci un breve insight proattivo.`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
  } catch (e: any) {
      console.error("AI Error:", e);
      return "Errore nella comunicazione con l'AI: " + e.message;
  }
}
