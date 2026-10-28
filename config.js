// Endereço de cada sistema no Google: a URL do "App da Web" (termina em /exec).
// Ao publicar uma nova versão pelo "Gerenciar implantações", a URL continua a mesma.
const CHAMADOS = {
  equipes: {
    ti: {
      nome: 'TI',
      descricao: 'Computador, impressora, internet, sistemas, e-mail, ramal',
      api: 'https://script.google.com/macros/s/AKfycbxY-xmofCi-qDzwMk5IZnI9DdvYMLTrU4AihlTg4cCjA-rPdhtpAk_Gbq7CYbEyRS7x/exec'
    },
    manutencao: {
      nome: 'Manutenção',
      descricao: 'Elétrica, hidráulica, ar-condicionado, móveis, portas',
      api: 'https://script.google.com/macros/s/AKfycbw7RxVKmzjZEAXLuD8-0B-3TgxymtobVhxxZc98y3bzh3fSJc4sJ4q_DO7olrMKSKCP/exec'
    }
  }
};
