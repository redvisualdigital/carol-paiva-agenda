/* Demonstração da agenda: faz o papel do Firebase, mas guarda tudo no próprio aparelho (localStorage).
   Na primeira abertura entra com os serviços de exemplo e alguns horários de exemplo.
   Na versão oficial, este arquivo sai e entra o Firebase (login + banco na nuvem), igual ao da Essence Glam. */
(function(){
  const KEY = "carolpaiva.demo.v2";
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  const dia = n => { const d = new Date(); d.setDate(d.getDate()+n); return ymd(d); };

  const CUID = "• Nas primeiras 24h, não molhe os cílios.\n• Não use rímel nem demaquilante oleoso.\n• Penteie com a escovinha todo dia.\n• Durma de barriga pra cima sempre que puder.";
  const sv = (id, nome, preco, duracao, retornoDias) => ({id, nome, profId: "carol", preco, duracao, retornoDias, cuidados: CUID});
  function seed(){
    const cfg = {
      estudio: "Carol Paiva · Lash Designer",
      profissionais: [{id: "carol", nome: "Carol Paiva", area: "Cílios e sobrancelhas", cor: "#8A715E"}],
      servicos: [
        sv("s-vb", "Volume brasileiro", 150, 120, 20),
        sv("s-vi", "Volume inglês", 180, 150, 20),
        sv("s-fox", "Fox Eyes", 190, 150, 20),
        sv("s-man", "Manutenção de cílios", 95, 90, 20),
        sv("s-ds", "Design de sobrancelhas", 40, 40, 20),
        sv("s-bl", "Brow Lamination", 120, 60, 45)
      ],
      reservaPct: 10, reservaHora: "23:59",
      semProxima: "^$nenhum", proxDe: 7, proxAte: 15,
      domicilioServicos: "^$sem-domiciliar",
      taxas: {"Cartão de débito": {pct: 0, proxDiaUtil: false}, "Cartão de crédito": {pct: 0, proxDiaUtil: false}, "Link de pagamento (crédito)": {pct: 0, proxDiaUtil: false}}
    };
    const cli = (nome, tel) => ({nome, telefone: tel, obs: "", criadoEm: dia(-60)});
    const ag = (cid, sid, nome, data, hora, status, valor, dur) => ({clienteId: cid, profId: "carol", divisao: [], servicos: [{id: sid, nome, preco: valor, duracao: dur}], servicoId: sid, servicoNome: nome, domicilio: null, data, hora, valor, duracao: dur, obs: "", status, criadoEm: new Date().toISOString()});
    const ags = {
      a1: ag("c1","s-vb","Volume brasileiro",dia(0),"08:00","concluido",150,120),
      a2: ag("c2","s-ds","Design de sobrancelhas",dia(0),"10:30","concluido",40,40),
      a3: ag("c3","s-fox","Fox Eyes",dia(0),"13:00","confirmado",190,150),
      a4: ag("c4","s-man","Manutenção de cílios",dia(0),"16:00","agendado",95,90),
      a5: ag("c5","s-bl","Brow Lamination",dia(1),"09:00","confirmado",120,60),
      a6: ag("c6","s-vi","Volume inglês",dia(1),"14:00","agendado",180,150),
      a7: ag("c2","s-man","Manutenção de cílios",dia(2),"10:00","agendado",95,90)
    };
    const cx = {}; let n = 0;
    const ent = (d, desc, v, forma) => cx["e"+(++n)] = {tipo:"entrada", data: dia(d), valor: v, bruto: v, forma, categoria:"Atendimento", profId:"carol", descricao: desc};
    const sai = (d, desc, v, cat) => cx["s"+(++n)] = {tipo:"saida", data: dia(d), valor: v, forma:"", categoria: cat, profId:"", descricao: desc};
    const hoje = new Date().getDate();
    const pass = [[0,"Ana Luiza · Volume brasileiro",150,"Pix"],[0,"Bruna Costa · Design de sobrancelhas",40,"Dinheiro"],[-1,"Lívia Martins · Fox Eyes",190,"Cartão de crédito"],[-1,"Paula Ramos · Manutenção de cílios",95,"Pix"],[-2,"Carla Dias · Brow Lamination",120,"Pix"],[-3,"Fernanda Lopes · Volume inglês",180,"Cartão de débito"],[-4,"Bruna Costa · Manutenção de cílios",95,"Pix"],[-5,"Júlia Neves · Volume brasileiro",150,"Pix"],[-6,"Ana Luiza · Design de sobrancelhas",40,"Dinheiro"],[-7,"Renata Alves · Fox Eyes",190,"Pix"],[-8,"Lívia Martins · Manutenção de cílios",95,"Cartão de crédito"],[-9,"Paula Ramos · Brow Lamination",120,"Pix"]];
    pass.filter(p => -p[0] < hoje).forEach(p => ent(...p));
    const res = {}; const porDia = {};
    pass.filter(p => -p[0] < hoje && p[0] < 0).forEach(p => porDia[p[0]] = (porDia[p[0]]||0) + p[2]);
    Object.entries(porDia).forEach(([d, fat]) => { const v = Math.round(fat*10)/100; res[dia(+d)+"_carol"] = {data: dia(+d), profId:"carol", faturado: fat, saidas: 0, pct: 10, valor: v, confirmadoEm: new Date().toISOString()}; });
    if (hoje > 3) sai(-3, "Fios e cola", 180, "Material");
    if (hoje > 5) sai(-5, "Aluguel da sala", 450, "Aluguel");
    const ret = (cid, nome, d) => ({clienteId: cid, agendamentoId: "", profId: "carol", servicoId: "", servicoNome: nome, feito: false, tipo: "retorno", data: dia(d)});
    return {
      config: {geral: cfg},
      clientes: {c1: cli("Ana Luiza Rocha","(37) 99800-0001"), c2: cli("Bruna Costa","(37) 99800-0002"), c3: cli("Lívia Martins","(37) 99800-0003"), c4: cli("Paula Ramos","(37) 99800-0004"), c5: cli("Carla Dias","(37) 99800-0005"), c6: cli("Fernanda Lopes","(37) 99800-0006"), c7: cli("Júlia Neves","(37) 99800-0007"), c8: cli("Renata Alves","(37) 99800-0008")},
      agendamentos: ags,
      caixa: cx,
      acompanhamentos: {r1: ret("c7","Manutenção de cílios",-1), r2: ret("c8","Manutenção de cílios",0), r3: ret("c1","Design de sobrancelhas",2)},
      reservas: res, pedidos: {p1: {nome: "Mariana Souza", telefone: "(37) 99800-0010", tecnica: "Volume brasileiro", tipo: "primeira aplicação", dia: dia(3), hora: "09:00", periodo: "às 09:00", obs: "", criadoEm: dia(0)+" 07:52"}}
    };
  }
  let store;
  try { store = JSON.parse(localStorage.getItem(KEY)); } catch(e){}
  if (!store || !store.config) store = seed();
  ["config","clientes","agendamentos","caixa","acompanhamentos","reservas","pedidos"].forEach(c => store[c] = store[c] || {});
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e){} };
  save();

  const subs = []; let n = 0;
  const notify = () => { save(); setTimeout(() => subs.forEach(f => f()), 0); };
  const clone = d => JSON.parse(JSON.stringify(d === undefined ? null : d));
  const novoId = () => Date.now().toString(36) + (++n).toString(36) + Math.random().toString(36).slice(2, 6);
  function docRef(c, id){ return { id,
    set: async d => { store[c][id] = clone(d); notify(); },
    update: async d => { store[c][id] = {...store[c][id], ...clone(d)}; notify(); },
    delete: async () => { delete store[c][id]; notify(); },
    get: async () => ({exists: !!store[c][id], data: () => store[c][id]}),
    onSnapshot: cb => { const f = () => cb({exists: !!store[c][id], data: () => store[c][id]}); subs.push(f); f(); return () => {}; } }; }
  function q(c, filt){ return {
    doc: id => docRef(c, id || novoId()), orderBy: () => q(c, filt), limit: () => q(c, filt),
    where: (k, op, v) => q(c, d => d[k] === v),
    get: async () => ({docs: Object.entries(store[c]).map(([i, d]) => ({id: i, data: () => d}))}),
    onSnapshot: cb => { const f = () => cb({docs: Object.entries(store[c]).filter(([i, d]) => !filt || filt(d)).map(([i, d]) => ({id: i, data: () => d}))}); subs.push(f); f(); return () => {}; } }; }
  const db = { collection: c => q(c), doc: p => { const [c, i] = p.split("/"); return docRef(c, i); }, settings(){}, enablePersistence: async () => {},
    batch(){ const ops = []; return {set: (r, d) => ops.push(() => r.set(d)), commit: async () => { for (const o of ops) await o(); }}; } };
  /* login da demonstração: e-mail carol@demo e senha 123456 (na versão oficial é o login do Firebase) */
  const SK = "carolpaiva.sessao"; let authCb = null;
  const sess = () => { try { const e = localStorage.getItem(SK); return e ? {email: e} : null; } catch(e){ return null; } };
  const auth = { setPersistence: async () => {},
    onAuthStateChanged: cb => { authCb = cb; setTimeout(() => cb(sess()), 0); },
    signOut: async () => { try { localStorage.removeItem(SK); } catch(e){} if (authCb) authCb(null); },
    signInWithEmailAndPassword: async (e, s) => { if (String(e).trim().toLowerCase() === "carol@demo" && s === "123456") { try { localStorage.setItem(SK, "carol@demo"); } catch(x){} if (authCb) authCb(sess()); } else throw {code: "auth/invalid-credential"}; },
    sendPasswordResetEmail: async () => { throw {code: "auth/demo"}; } };
  window.firebase = { initializeApp(){}, auth: Object.assign(() => auth, {Auth: {Persistence: {LOCAL: 1}}}), firestore: () => db };
  window.__DEMO = true;
  window.__demoReset = () => { try { localStorage.removeItem(KEY); } catch(e){} location.reload(); };
})();
