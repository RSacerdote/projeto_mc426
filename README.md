# Projeto de Mobilidade Ativa Unicamp - MC426
O projeto propõe o desenvolvimento de um aplicativo para incentivar a mobilidade ativa dentro do campus da Unicamp. O sistema funcionará por meio da acumulação de créditos conforme o usuário utilizar meios sustentáveis de transporte, como bicicletas ou caminhadas. Além disso, o aplicativo irá mapear bicicletários, indicando a quantidade de bicicletas e vagas disponíveis.

O objetivo é melhorar a mobilidade no campus, facilitar o uso de bicicletas e estimular deslocamentos sustentáveis com um sistema de incentivo. Futuramente, funcionalidades adicionais poderão incluir cálculo de rotas otimizadas e monitoramento em tempo real das bicicletas estacionadas.

## Integrantes
- Caio Vinicius Castro dos Santos - 214188
- Fernando de Araujo Sacerdote - 240807
- Rodrigo de Araujo Sacerdote - 224176
- Tiago Perrupato Antunes - 194058

## Arquitetura do Sistema

### 1. Diagrama de Componentes (C4 - Nível 3)

[Diagrama C4 - Nível 3](inserir caminho pra imagem)

### 2. Estilo Arquitetural

- **Microserviços**: 
  - Serviços independentes com banco de dados dedicados
  - Frontend desacoplado
  
- **Frontend Desacoplado**:
  - Single Page Application
  - Consumo de APIs via API Gateway

### 3. Descrição dos Componentes e Responsabilidades

#### **Frontend (SPA)**
- **Autenticação**: Gerencia interfaces de login/registro, integrando com backend.
- **Mapa**: Exibe rotas otimizadas e status de bicicletários em tempo real.   
- **Comunidade**: Permite visualização e interação com grupos/campanhas. 
- **Loja**: Facilita o resgate de prêmios usando créditos acumulados.  

#### **Auth Service**
- **Cadastro e Login**: Valida credenciais e emite tokens de autenticação seguros.  

#### **Comunidade Service**
- **Campanhas**: Cria e gerencia desafios coletivos com regras personalizáveis.   
- **Grupos**: Organiza usuários em comunidades com interação em tempo real.    

#### **Mapa Service**
- **API do Mapa**: Integra com serviços externos para renderização de mapas.   
- **Rotas**: Calcula trajetos eficientes para mobilidade ativa.   
- **Bicicletários**: Monitora vagas e atualiza status.   

#### **Crédito Service**
- **Prêmios e Recompensas**: Gerencia sistema de recompensas usando Abstract Factory.  
- **Pontos**: Registra acúmulo e histórico de pontos dos usuários.  
- **Tarefas**: Define atividades para ganho de pontos (ex: rotas concluídas).   

### 4. Padrão de Projeto: Abstract Factory

Para o componente Prêmios e Recompensas escolhemos o padrão de projeto de Abstract Factory (Fábrica Abstrata), pois teremos uma classe base chamada Rewards que conterá as propriedades comuns de todas as recompensas como quantidade de pontos, data de início e fim de disponibilidade, mas ela não vai ser instanciável pois ainda falta o jeito que será entregue, para isso teremos classes herdando Rewards com sua implementação específica para a entrega e qualquer processamento a mais necessário.