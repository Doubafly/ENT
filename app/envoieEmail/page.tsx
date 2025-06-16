
export default function SendEmail(vEmail: string,typeEnvoie : string, id:string) {
    const email = vEmail;
    if (!email) {
      console.log("cv pas");
    }

    const reset_code = Math.floor(100000 + Math.random() * 900000);
    console.log("Code généré:", reset_code);
    
    // Envoi du code par email
    fetch("https://codingmailer.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Code de réinitialisation",
        message: `Votre code de réinitialisation est: ${reset_code}\n\nCe code expirera dans 15 minutes.`,
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Erreur lors de l'envoi de l'email");
        return response.json();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      if (typeEnvoie === "forgotPassword") {
        const handleSub = async () => {
          const tokenExpiration = new Date(Date.now() + 20 * 60 * 1000).toISOString();
            const payload = {
              email:email,
              token:reset_code.toString(),
              expiresAt:tokenExpiration,
            };
            console.log(payload);
            
            try {
              const response = await fetch("/api/forgotPassword", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });
      
            }catch (error) {
              console.log("Erreur de serveur", error);
            }
        };
        handleSub();
      }
      if (typeEnvoie === "valideEmail") {
        console.log("Email Validation Sent");
      }
  }
