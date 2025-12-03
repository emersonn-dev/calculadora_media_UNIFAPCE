// script.js
document.addEventListener('DOMContentLoaded', () => {
  const tde1 = document.getElementById('tde1');
  const tde2 = document.getElementById('tde2');
  const tde3 = document.getElementById('tde3');
  const tde4 = document.getElementById('tde4');
  const avp1 = document.getElementById('avp1');
  const avp2 = document.getElementById('avp2');

  const btnCalc = document.getElementById('calcular');
  const btnClear = document.getElementById('limpar');

  const outMediaTDEs = document.getElementById('mediaTdes');
  const outMediaFinal = document.getElementById('mediaFinal');
  const outStatus = document.getElementById('status');

  function parseNum(el){
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : 0;
  }

  function validarValor(v){
    // garante que esteja entre 0 e 10
    if (v < 0) return 0;
    if (v > 10) return 10;
    // arredonda para 1 casa decimal para evitar entradas estranhas
    return Math.round(v*10)/10;
  }

  function calcular(){
    let a = validarValor(parseNum(tde1));
    let b = validarValor(parseNum(tde2));
    let c = validarValor(parseNum(tde3));
    let d = validarValor(parseNum(tde4));
    let av1 = validarValor(parseNum(avp1));
    let av2 = validarValor(parseNum(avp2));

    // média dos TDEs (decisão: média aritmética dos 4)
    const mediaTdes = (a + b + c + d) / 4;

    // média final
    const mediaFinalRaw = (av1 * 0.4) + (av2 * 0.4) + (mediaTdes * 0.2);
    // arredonda para 2 casas
    const mediaFinal = Math.round(mediaFinalRaw * 100) / 100;

    outMediaTDEs.textContent = `Média TDEs: ${mediaTdes.toFixed(2)}`;
    outMediaFinal.textContent = `Média Final: ${mediaFinal.toFixed(2)}`;

    // status
    outStatus.className = 'status'; // reseta classes
    let mensagem = '';
    if (mediaFinal >= 7.0){
      mensagem = 'Aprovado';
      outStatus.classList.add('aprovado');
    } else if (mediaFinal >= 4.0){
      mensagem = 'Vai pra AVF';
      outStatus.classList.add('avf');
    } else {
      mensagem = 'Reprovado';
      outStatus.classList.add('reprovado');
    }

    outStatus.textContent = `Status: ${mensagem}`;
  }

  btnCalc.addEventListener('click', calcular);

  btnClear.addEventListener('click', () => {
    [tde1,tde2,tde3,tde4,avp1,avp2].forEach(i => i.value = '0');
    outMediaTDEs.textContent = 'Média TDEs: —';
    outMediaFinal.textContent = 'Média Final: —';
    outStatus.textContent = 'Status: —';
    outStatus.className = 'status';
  });

  // permitir ENTER para calcular quando focado em inputs
  [tde1,tde2,tde3,tde4,avp1,avp2].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calcular();
      }
    });
  });
});
