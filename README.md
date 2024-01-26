# Clean Architecture

- Termo criado por Robert C. Martin (Uncle Bob) em 2012
- Proteção do domínio da aplicação
- Baixo acoplamento entre as camadas
- Orienteda a casos de uso (a intenção sistema)

### Livro "Clean Architecture"

- Fala especificamente sobre "Clean Architecture" somente em 7 páginas do livro
- Tudo que ele fala especificamente sobre "Clean Architecture" está literalmente em um artigo em seu blog

## Pontos importantes sobre arquitetura

- Formato que o software terá
- Divisão de componentes
- Comunicação entre componentes
- Uma boa arquitetura vai facilitar o processo de desenvolvimento, deploy, operação e manutenção
- "The strategy behind that facilitation is to leave as many options open as possible, for as long as possible." C., Martin Robert. Clean Architecture (p. 136)

## Objetivos de uma boa arquitetura

O objetivo principal da arquitetura é dar suporte ao ciclo de vida do sistema. Uma boa arquitetura torna o sistema fácil d eentender, fácil de desenvolver, fácil de manter e fácil de implantar. O objetivo final é minimizar o custo de vida útil do sistema e maximizar a produtividade do programador. C., Martin Robert (p. 137)

## Regras vs Detalhes

- Regras de negócio trazem o real valor para o software
- Detalhes ajudam a suportar as regras (ex. tecnologias)
- Detalhes não dvem impactar nas regras de negócio
- Frameworks, banco de dados, apis não devem impactar as regras

> __DDD__ Atacar a complexidade no coração do software

## Casos de uso

- Intenção do código
- Clareza de cada comportamento do software
- Detalhes não devem impactar nas regras de negócio
- Frameworks, banco de dados, apis não devem impactar as regras

## Use case X Single-responsibility principle

- Temos a tendência de "reaproveitar" casos de uso por serem muito parecidos.
  - Ex.Alterar vs Inserir. Ambos consultam se o registro existe, persistem dados, MAS, são casos de uso diferentes.
- SRP mudam por razões diferentes

## Casos de uso contam uma história

#### O que é necessário para conseguir fazer o empréstimo?

- __INPUT__ Nome, endereço, data de nascimento, etc.
- __OUTPUT__ Mesmas informações para releitura + Score de crédito.
- __Curso primário__:
  - Aceita e valida o nome.
  - Valida o endereço, data de nascimento, etc.
  - Pega o score de crétido.
  - Se o score for menor que 500, ativação negada.
  - Caso contrário, cadastrar o cliente e ativar o empréstimo.

## Limites arquiteturais

Tudo que não impacta diretamente nas regras de negócio deve estar em um limite arquitetural diferente. Ex. Não será o frontend, banco de dados que mudarão as regras de negócio da aplicação.

![Limites arquiteturais](./images/architecture-limit.png)

## Input vs Output

- No final do dia, tudo se resume a um input que retorna um output
  - Ex. criar um pedido (dados do pedido = input)
    - Pedido criado (dados de retorno do pedido)
- Simplifique seu raciocínio ao criar um software sempre pensando em input e output

## DTO (Data Transfer Object)

- Trafegar dados entre os limites arquiteturais
- Objeto anêmico, sem comportamento
- Contém dados (input ou output)
- NÃO possui regras de negócio
- NÃO possui comportamento
- NÃO faz nada!

Exemplo:

- API > CONTROLLER > USE CASE > ENTITY
- Controller cria um DTO com os dados recebidos e envia para o use case
- Use case executa seu fluxo, pega o resultado, cria um DTO para output e retorna para o controller

## Presenters

- Objetos de transformação
- Adequa o DTO de output no formato correto para entregar o resultado
- Lembrando: Um sistema por ter diversos formatos de entrega: Ex. XML, JSON, Protobuf, GraphQL, CLI, etc.

```javascript
input = new CategoryInputDTO("name");
output = new CreateCategoryUseCase(input);
jsonResult = CategoryPresenter(output).toJson();
xmlResult = CategoryPresenter(output).toXML();
```

## Entities

As Entities da Clean Architecture são diferentes das entities do Domain Driven Design. Entities na Clean Architecture, na realidade, define aquilo como uma camada, entities no Domain Driven Design é a representação de algo único na aplicação. Entitie, na Clean Architecture é um conceito de camada, onde diz que as regras de negócio estão dentro dessa camada. As nossas entities no DDD, no final das contas, fazem parte eventualmente de um agregado. Então, você vai perceber que a palavra agregado na Clean Architecture não existe. Portanto, não podemos assumir que as entities da Clean Architecture são iguais as entities do DDD.

A Clean Architecture define: *“entity é igual a camada de regra de negócio”*. Ele fala até o seguinte: *“Enterprises Business Rules”*. Logo, o que acontece? A ideia de Entities na Clean Architecture significa: **essa camada aqui não muda**. Ela é invariável, é cada vez mais solidificada. Por quê? Porque, independente do que aconteça na minha aplicação, são as regras globais dela. A minha aplicação sempre vai se comportar dessa forma, porque essa camada possui o coração dela. Portanto, ela não varia, basicamente, ela é sólida, ela sempre vai ser aplicada daquela forma. Um outro ponto, inclusive em relação à parte do Clean Architecture, se você for olhar o próprio livro do Uncle Bob, ele não define de forma explícita como eu crio as minhas entities. Ele dá um exemplo no livro, em que ele coloca um diagrama onde é o UML, como se fosse uma classe com três métodos, mas ele não tem aquela regrinha explicando “é assim que cria uma entitie que funciona, ela tem um ID, ela tem isso”, não tem nada disso. O que ele fala é o seguinte: você vai criar uma camada, ela vai tentar ser a mais pura possível, mas ela vai ter tudo que é regra de negócio e todo mundo que chegar nessa camada, no final das contas, vai ter que se virar com isso. Como você vai fazer isso? Arrume um jeito. Ele não é explícito de como fazer.
