import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Regulamento() {
  const { user } = useAuth()

  // Destino do botão de voltar depende do estado de login
  const perfilUsuario = user?.perfil || user?.tipo
  const voltarRota = perfilUsuario === 'administrador'
    ? '/admin/dashboard'
    : perfilUsuario === 'cliente'
      ? '/cliente/dashboard'
      : '/'

  const voltarLabel = perfilUsuario ? '← Voltar ao dashboard' : '← Voltar à tela inicial'

  return (
    <div className="page">
      {/* Cabeçalho da página */}
      <div className="regulamento-header">
        <div className="regulamento-header-info">
          <span className="regulamento-header-icon">📋</span>
          <div>
            <h1 className="regulamento-titulo">Regulamento</h1>
            <p className="regulamento-header-sub">Regras de uso da plataforma BetArena</p>
          </div>
        </div>
        <Link to={voltarRota} className="btn-secondary regulamento-voltar-btn">
          {voltarLabel}
        </Link>
      </div>

      <div className="regulamento">
        <p className="regulamento-aviso">
          Esta plataforma tem finalidade <strong>exclusivamente acadêmica</strong>. Todos os
          valores, saldos, apostas, prêmios e bônus são <strong>fictícios</strong>.
        </p>

        <section className="regulamento-secao">
          <h2>1. Cadastro e Acesso</h2>
          <ul>
            <li>O cadastro é gratuito e aberto a qualquer usuário.</li>
            <li>Cada usuário deve informar nome, e-mail, CPF, data de nascimento e senha.</li>
            <li>E-mail e CPF devem ser únicos — não é permitido cadastrar dois usuários com os mesmos dados.</li>
            <li>O acesso é diferenciado por perfil: <strong>Cliente</strong> e <strong>Administrador</strong>.</li>
            <li>Cada perfil acessa apenas as áreas permitidas para ele.</li>
          </ul>
        </section>

        <section className="regulamento-secao">
          <h2>2. Saldo Fictício</h2>
          <ul>
            <li>Todo cliente começa com saldo R$ 0,00.</li>
            <li>O saldo pode ser adicionado livremente pelo próprio cliente — os valores são fictícios.</li>
            <li>Não é possível apostar sem saldo disponível.</li>
            <li>O valor apostado é descontado do saldo no momento da confirmação da aposta.</li>
            <li>Em caso de vitória, o prêmio (<em>valor apostado × odd</em>) é creditado automaticamente.</li>
          </ul>
        </section>

        <section className="regulamento-secao">
          <h2>3. Eventos e Apostas</h2>
          <ul>
            <li>Os eventos são criados pelos administradores, que definem os dois times, a data/hora da partida e a data/hora de abertura das apostas.</li>
            <li>Um evento só aparece como disponível para aposta quando a data de abertura já passou e a partida ainda não começou.</li>
            <li>Cada aposta tem uma <strong>odd aleatória</strong> gerada no momento da escolha do time (entre 1,50 e 5,00).</li>
            <li>Não é permitido apostar duas vezes no mesmo evento.</li>
            <li>O cliente escolhe apenas o time vencedor — não há mercados alternativos (empate, placar, etc.).</li>
          </ul>
        </section>

        <section className="regulamento-secao">
          <h2>4. Encerramento e Resultado</h2>
          <ul>
            <li>O administrador pode fechar um evento a qualquer momento, impedindo novas apostas.</li>
            <li>O resultado só pode ser gerado após o fechamento das apostas.</li>
            <li>O vencedor é <strong>sorteado aleatoriamente</strong> entre os dois times — não reflete resultados reais.</li>
            <li>Após o resultado, os apostadores que acertaram recebem o prêmio automaticamente.</li>
            <li>Eventos já resolvidos não podem ser editados ou reabertos.</li>
          </ul>
        </section>

        <section className="regulamento-secao">
          <h2>5. Ranking e Premiação</h2>
          <ul>
            <li>O ranking classifica os jogadores pelo <strong>total de prêmios acumulados</strong> em apostas resolvidas.</li>
            <li>Os três primeiros colocados recebem títulos fictícios: 🥇 Campeão, 🥈 Vice-Campeão e 🥉 Terceiro Lugar.</li>
            <li>Os bônus do pódio (R$ 500, R$ 250 e R$ 100) são <strong>fictícios e meramente ilustrativos</strong>.</li>
            <li>O ranking é atualizado em tempo real conforme os resultados são gerados.</li>
          </ul>
        </section>

        <section className="regulamento-secao">
          <h2>6. Responsabilidade e Uso Acadêmico</h2>
          <ul>
            <li>Esta plataforma foi desenvolvida como projeto final de curso e não possui fins comerciais.</li>
            <li>Nenhum valor real é movimentado em nenhuma circunstância.</li>
            <li>Os dados cadastrados são armazenados localmente via JSON Server e têm caráter exclusivamente didático.</li>
            <li>A plataforma não incentiva, promove ou facilita apostas com dinheiro real.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default Regulamento
