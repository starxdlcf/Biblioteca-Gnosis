//Ryan, vou comentar p vc entender oq eu fiz quando ler, blz?
//Primeiro, escreve isso no seu terminal: npm install @fastify/swagger @fastify/swagger-ui

import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

// aq são os imports que a gente fez normal

import { CarteirinhaController } from "../features/carteirinhas/carteirinha.controller.js";
import { CarteirinhaRoutes } from "../features/carteirinhas/carteirinha.routes.js";
import { CarteirinhaService } from "../features/carteirinhas/carteirinha.service.js";
import { EmprestimoController } from "../features/emprestimos/emprestimo.controller.js";
import { EmprestimoRoutes } from "../features/emprestimos/emprestimo.routes.js";
import { EmprestimoService } from "../features/emprestimos/emprestimo.service.js";
import { MultaController } from "../features/multas/multa.controller.js";
import { MultaRoutes } from "../features/multas/multa.routes.js";
import { MultaService } from "../features/multas/multa.service.js";
import { AutorController } from "../features/autores/autor.controller.js";
import { AutorRoutes } from "../features/autores/autor.routes.js";
import { AutorService } from "../features/autores/autor.service.js";
import { LivroRepository } from "../features/livros/livro.repository.js";
import { LivroService } from "../features/livros/livro.service.js";
import { LivroController } from "../features/livros/livro.controller.js";
import { LivroRoutes } from "../features/livros/livro.routes.js";
import { LivroAutorController } from "../features/livroautor/livroAutor.controller.js";
import { LivroAutorRoutes } from "../features/livroautor/livroAutor.routes.js";
import { LivroAutorService } from "../features/livroautor/livroAutor.service.js";
import { LivroAutorRepository } from "../features/livroautor/livroAutor.repository.js";
import { GeneroController } from "../features/generos/genero.controller.js";
import { GeneroRoutes } from "../features/generos/genero.routes.js";
import { GeneroService } from "../features/generos/genero.service.js";
import { GeneroRepository } from "../features/generos/genero.repository.js";
import { LivroGeneroController } from "../features/livrogenero/livroGenero.controller.js";
import { LivroGeneroRoutes } from "../features/livrogenero/livroGenero.routes.js";
import { LivroGeneroService } from "../features/livrogenero/livroGenero.service.js";
import { LivroGeneroRepository} from "../features/livrogenero/livroGenero.repository.js";

export default async function routes(fastify) {
  fastify.get("/", async () => {
    return {
      message: "✅ API Biblioteca Gnosis funcionando",
      version: "1.0.0",
    };
  });


  // Essa parte registra o Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Gnosis',
        description: 'Documentação da API desenvolvida para o projeto da Biblioteca Gnosis - por Anna Luísa e Ryan Tomaz',
        version: '1.0.0'
      }
    }
  });

  // Esse UI é a parte da interface da documentação, pq só com o swagger tem a documentação mas sem o visual. O UI é registrado aqui em baixo
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });


  // a partir daqui são as nossas rotas 

  const carteirinhaService = new CarteirinhaService();
  const carteirinhaController = new CarteirinhaController(carteirinhaService);
  const carteirinhaRoutes = new CarteirinhaRoutes(carteirinhaController);

  fastify.register(
    async (instance) => {
      carteirinhaRoutes.register(instance);
    },
    { prefix: "/carteirinhas" }
  );

  const livroRepository = new LivroRepository();
  const livroService = new LivroService(livroRepository);
  const livroController = new LivroController(livroService);
  const livroRoutes = new LivroRoutes(livroController);

  fastify.register(
    async (instance) => {
      livroRoutes.register(instance);
    },
    { prefix: "/livros" }
  );

  const livroautorRepository = new LivroAutorRepository();
  const livroautorService = new LivroAutorService(livroautorRepository);
  const livroautorController = new LivroAutorController(livroautorService);
  const livroautorRoutes = new LivroAutorRoutes(livroautorController);

  fastify.register(
    async (instance) => {
      livroautorRoutes.register(instance);
    },
    { prefix: "/livroautor" }
  );

  const autorService = new AutorService();
  const autorController = new AutorController(autorService);
  const autorRoutes = new AutorRoutes(autorController);

  fastify.register(
    async (instance) => {
      autorRoutes.register(instance);
    },
    { prefix: "/autores" }
  );


  const emprestimoService = new EmprestimoService();
  const emprestimoController = new EmprestimoController(emprestimoService);
  const emprestimoRoutes = new EmprestimoRoutes(emprestimoController);

  fastify.register(
    async (instance) => {
      emprestimoRoutes.register(instance);
    },
    { prefix: "/emprestimos" }
  );

  const multaService = new MultaService();
  const multaController = new MultaController(multaService);
  const multaRoutes = new MultaRoutes(multaController);

  fastify.register(
    async (instance) => {
      multaRoutes.register(instance);
    },
    { prefix: "/multas" }
  );

  const generoRepository = new GeneroRepository();
  const generoService = new GeneroService(generoRepository);
  const generoController = new GeneroController(generoService);
  const generoRoutes = new GeneroRoutes(generoController);


  fastify.register(
    async (instance) => {
      generoRoutes.register(instance);
    },
    { prefix: "/generos"}
  );


  const livrogeneroRepository = new LivroGeneroRepository();
  const livrogeneroService = new LivroGeneroService(livrogeneroRepository);
  const livrogeneroController = new LivroGeneroController(livrogeneroService);
  const livrogeneroRoutes = new LivroGeneroRoutes(livrogeneroController);


  fastify.register(
    async (instance) => {
      livrogeneroRoutes.register(instance);
    },
    { prefix: "/livrogenero"}
  );
  

}
  
