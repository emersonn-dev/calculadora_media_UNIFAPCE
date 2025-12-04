// script.js
(function(){
  const ids = ['tde1','tde2','tde3','tde4','avp1','avp2'];
  const elems = {};
  ids.forEach(id => elems[id] = document.getElementById(id));
  const calcBtn = document.getElementById('calcBtn');
  const clearBtn = document.getElementById('clearBtn');
  const mediaTDESpan = document.getElementById('mediaTDE');
  const mediaSemSpan = document.getElementById('mediaSem');
  const statusBadge = document.getElementById('statusBadge');
  const errorBox = document.getElementById('error');
  const message = document.getElementById('message');

  // validação em tempo real: garante 0..10 e impede caracteres inválidos
  ids.forEach(id => {
    const el = elems[id];
    el.addEventListener('input', (e) => {
      errorBox.textContent = '';
      message.textContent = '';
      let v = el.value;
      if (v === '') return; // placeholder visível quando vazio
      // converter vírgula -> ponto
      v = v.replace(',', '.');
      // permitir apenas número válido
      const num = parseFloat(v);
      if (Number.isNaN(num)) {
        el.value = '';
        return;
      }
      if (num < 0) {
        el.value = '0';
        flashError('Valores menores que 0 foram ajustados para 0.');
        return;
      }
      if (num > 10) {
        el.value = '10';
        flashError('Valor máximo permitido = 10. Ajustado para 10.');
        return;
      }
      // limita casas decimais a uma ou duas (opcional)
      el.value = (Math.round(num * 100) / 100).toString();
    });
  });

  function flashError(txt){
    errorBox.textContent = txt;
    setTimeout(()=> {
      // mantém por 3.2s
      errorBox.textContent = '';
    }, 3200);
  }

  function readVal(id){ 
    const v = elems[id].value;
    if (v === '') return null;
    const n = Number(String(v).replace(',', '.'));
    if (Number.isNaN(n)) return null;
    return n;
  }

  calcBtn.addEventListener('click', () => {
    // lê valores
    const vals = ids.map(readVal);
    // se algum AVP/TDE estiver vazio assumimos 0? Melhor exigir preenchimento parcial.
    // Vou tratar empty como 0 (mas informo isso ao usuário).
    const usedEmpty = vals.some(v => v === null);
    const numeric = vals.map(v => v === null ? 0 : v);

    const [t1,t2,t3,t4,avp1,avp2] = numeric;
    // média TDEs
    const mediaTDE = (t1 + t2 + t3 + t4) / 4;
    const mediaSem = (avp1 * 0.4) + (avp2 * 0.4) + (mediaTDE * 0.2);

    mediaTDESpan.textContent = mediaTDE.toFixed(2);
    mediaSemSpan.textContent = mediaSem.toFixed(2);

    // decidir status
    // regra: <4 reprovado, >=4 && <7 AVF, >=7 aprovado
    statusBadge.hidden = false;
    statusBadge.className = 'badge'; // reset
    let statusText = '';
    if (mediaSem < 4) {
      statusBadge.classList.add('status--red');
      statusText = 'Reprovado';
      message.textContent = 'Que Pena vc reprovou, mas nn desista.';
    } else if (mediaSem >= 4 && mediaSem < 7) {
      statusBadge.classList.add('status--yellow');
      statusText = 'Vai para AVF';
      message.textContent = 'Você foi pra AVF, vai conseguir!.';
    } else { // >=7
      statusBadge.classList.add('status--green');
      statusText = 'Aprovado';
      message.textContent = 'Parabéns você foi aprovado!';
    }
    statusBadge.textContent = statusText;

    if (usedEmpty) {
      flashError('Campos vazios foram tratados como 0. Preencha tudo se quiser resultados mais precisos.');
    }
  });

  clearBtn.addEventListener('click', () => {
    ids.forEach(id => elems[id].value = '');
    mediaTDESpan.textContent = '—';
    mediaSemSpan.textContent = '—';
    statusBadge.hidden = true;
    message.textContent = '';
    errorBox.textContent = '';
  });

})();
