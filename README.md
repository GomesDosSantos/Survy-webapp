# Survy

<p>O sistema desenvolvido foi uma proposta de trabalho dado pelo professor Arley Ferreira na Fatec Prof. Jessen Vidal de São José dos Campos como projeto do semestre.</p>
<p>Para tanto, foi definido um sistema que visa criar um questionário de respostas a serem respondidas por pessoas elegíveis ao mesmo utilizando como framework o Angular, e o serviço de banco de dados em tempo real do Google, Firebase Real-Time Database. Portanto,</p>
<h3>Dependências</h3>
<p>
<img src="https://img.shields.io/npm/v/@angular/core.svg?color=green&label=Angular" >
<img src="https://img.shields.io/npm/v/bulma.svg?color=green&label=bulma" >
<img src="https://img.shields.io/npm/v/firebase.svg?color=green&label=firebase" >
</p>
<p>Segue-se os requisitos iniciais:</p>
<ul>
  <li>* [x] Login através de conexão com Google & Facebook</li>
  <li>* [x] Design Responsivo</li>
  <li>* [x] Um usuário pode criar inúmeros questionários e editá-los</li>
  <li>* [x] Cada questionário possui um título, data de início, fim e grupos de questões.</li>
  <li>* [x] Cada grupo de questão pode possuir diversas questões diferentes.</li>
  <li>* [x] As questões podem variar entre aberta ou fechada, as questões fechadas podem ser de múltipla escolha ou não.</li>
  <li>* [x] Os questionários podem ser respondidos apenas por pessoas que possuem um link de acesso, com e-mail e token.</li>
  <li>* [ ] É desejável poder enviar um e-mail as pessoas que podem acessar o questionário com o link correspondente.</li>
  <li>* [x] O questionário deve salvar as respostas de forma simples, para que seja possível buscar os resultados no futuro.</li>
</ul>

<h2>Desenvolvimento</h2>
<b>Valor notar que é necessário ter uma conta no Google e acesso ao Firebase Console para utilizar o projeto.</b>
<h3>Routing</h3>
<p>Para ser possível abranger as possibilidades do sistema, foi-se utilizado o <b>routing</b> do angular para mapear as rotas possíveis e utilizáveis, tais como: <i>Login</i>, <i>Home</i>, <i>Survey</i>, <i>SurveyComplete</i> e <i>Answer</i>.</p>
<h3>Serviços</h3>
<h4>Auth</h4>
<p>Desenvolveu-se o serviço <i>auth</i>, responsável por cuidar das respostas vindas do <i>Firebase Auth</i> e averiguar se um usuário está logado apropriadamente no site.</p>
<h4>Survey</h4>
<p>O serviço survey, por sua vez, foi feito para lidar com as transações no banco de dados a fim de salvar, editar, deletar ou visualizar algum dado.</p>
<h3>Classes</h3>
<p>Todas as classes utilizadas estão disponíveis no arquivo <a href="https://github.com/GomesDosSantos/Survy-webapp/blob/master/src/app/classes.ts">classes</a>, representates de como os dados são armazendas no banco de dados.</p>

<h2>Componentes</h2>

<h3>Login</h3>
<p>É a view responsável por apresentar os botões de login através do <i>Google</i> e <i>Facebook</i>. Um clique no botão serve de gatilho para a função correspondente de login no serviço <i>Auth</i></p>

<h3>Home</h3>
<p>Mostra ao usuários todos os seus questionários e a quantidade de visualizações que cada questionário possui, além dos botões de rápido acesso a criação, edição e exclusão de questionários. As funções que alteram um questionário de forma global estão presentes no serviço <i>Survey</i>, no entanto, a criação e edição do mesmo é feito através do componente <i>survey</i>.</p>

<h3>Survey</h3>
<p>Este componente cria um objeto questionário (classe: <i>Survey</i>) e o usuário o edita. No caso da edição, os dados do banco de dados são replicados no objeto privado do componente e renderizado na view.</p>

<h3>SurveyComplete</h3>
<p>É um componenete intermediário entre <i>Survey</i> e <i>Answer</i>, neste component, é possível definir quais usuários (e-mails) podem ter acesso ao questionário recém criado ou editado, não apenas isso, mas também é criado um token aleatório para cada e-mail juntamente para cópia rápida do link para responder ao questionário.</p>

<h3>Answer</h3>
<p>Neste componente é criado dois objetos questionário, um deles, o questionário original, e o outro, o que o usuário de fato responde.</p>
<p>Tal cuidado foi tomado devido a forma em que é manipulado as questões fechadas, ou seja, as que possuem alternativa. Estas questões possuem um contador que aumenta conforme as resposta por cada usuário, resultando em um montante de usuários que responderam tal questão, portanto, ao efetivamente salvar as respostas selecionadas pelo usuário, é feita uma verificação das diferenças entre o original e o editado, a fim de inserir apenas as diferenças e mesclar os novos dados no banco de dados.</p>





