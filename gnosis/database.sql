-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.autores_id_autor_seq;

CREATE SEQUENCE public.autores_id_autor_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.autores_id_autor_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.autores_id_autor_seq TO neondb_owner;

-- DROP SEQUENCE public.carteirinha_id_carteirinha_seq;

CREATE SEQUENCE public.carteirinha_id_carteirinha_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.carteirinha_id_carteirinha_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.carteirinha_id_carteirinha_seq TO neondb_owner;

-- DROP SEQUENCE public.emprestimos_id_emprestimo_seq;

CREATE SEQUENCE public.emprestimos_id_emprestimo_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.emprestimos_id_emprestimo_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.emprestimos_id_emprestimo_seq TO neondb_owner;

-- DROP SEQUENCE public.generos_id_genero_seq;

CREATE SEQUENCE public.generos_id_genero_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.generos_id_genero_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.generos_id_genero_seq TO neondb_owner;

-- DROP SEQUENCE public.livros_id_livro_seq;

CREATE SEQUENCE public.livros_id_livro_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.livros_id_livro_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.livros_id_livro_seq TO neondb_owner;

-- DROP SEQUENCE public.multas_id_multa_seq;

CREATE SEQUENCE public.multas_id_multa_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.multas_id_multa_seq OWNER TO neondb_owner;
GRANT ALL ON SEQUENCE public.multas_id_multa_seq TO neondb_owner;
-- public.autores definição

-- Drop table

-- DROP TABLE public.autores;

CREATE TABLE public.autores (
	id_autor serial4 NOT NULL,
	nome varchar(100) NOT NULL,
	CONSTRAINT autores_pkey PRIMARY KEY (id_autor)
);

-- Permissions

ALTER TABLE public.autores OWNER TO neondb_owner;
GRANT ALL ON TABLE public.autores TO neondb_owner;


-- public.carteirinha definição

-- Drop table

-- DROP TABLE public.carteirinha;

CREATE TABLE public.carteirinha (
	id_carteirinha serial4 NOT NULL,
	nome varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	telefone varchar(20) NULL,
	CONSTRAINT carteirinha_email_key UNIQUE (email),
	CONSTRAINT carteirinha_pkey PRIMARY KEY (id_carteirinha)
);

-- Permissions

ALTER TABLE public.carteirinha OWNER TO neondb_owner;
GRANT ALL ON TABLE public.carteirinha TO neondb_owner;


-- public.generos definição

-- Drop table

-- DROP TABLE public.generos;

CREATE TABLE public.generos (
	id_genero serial4 NOT NULL,
	nome varchar(50) NOT NULL,
	CONSTRAINT generos_nome_key UNIQUE (nome),
	CONSTRAINT generos_pkey PRIMARY KEY (id_genero)
);

-- Permissions

ALTER TABLE public.generos OWNER TO neondb_owner;
GRANT ALL ON TABLE public.generos TO neondb_owner;


-- public.livros definição

-- Drop table

-- DROP TABLE public.livros;

CREATE TABLE public.livros (
	id_livro serial4 NOT NULL,
	titulo varchar(150) NOT NULL,
	isbn varchar(20) NOT NULL,
	CONSTRAINT livros_isbn_key UNIQUE (isbn),
	CONSTRAINT livros_pkey PRIMARY KEY (id_livro)
);

-- Permissions

ALTER TABLE public.livros OWNER TO neondb_owner;
GRANT ALL ON TABLE public.livros TO neondb_owner;


-- public.emprestimos definição

-- Drop table

-- DROP TABLE public.emprestimos;

CREATE TABLE public.emprestimos (
	id_emprestimo serial4 NOT NULL,
	id_carteirinha int4 NOT NULL,
	id_livro int4 NOT NULL,
	data_emprestimo date DEFAULT CURRENT_DATE NOT NULL,
	data_devolucao_prevista date DEFAULT (CURRENT_DATE + '10 days'::interval) NOT NULL,
	data_devolucao_real date NULL,
	CONSTRAINT emprestimos_pkey PRIMARY KEY (id_emprestimo),
	CONSTRAINT emprestimos_id_carteirinha_fkey FOREIGN KEY (id_carteirinha) REFERENCES public.carteirinha(id_carteirinha),
	CONSTRAINT emprestimos_id_livro_fkey FOREIGN KEY (id_livro) REFERENCES public.livros(id_livro)
);

-- Permissions

ALTER TABLE public.emprestimos OWNER TO neondb_owner;
GRANT ALL ON TABLE public.emprestimos TO neondb_owner;


-- public.livro_autor definição

-- Drop table

-- DROP TABLE public.livro_autor;

CREATE TABLE public.livro_autor (
	id_livro int4 NOT NULL,
	id_autor int4 NOT NULL,
	CONSTRAINT livro_autor_pkey PRIMARY KEY (id_livro, id_autor),
	CONSTRAINT livro_autor_id_autor_fkey FOREIGN KEY (id_autor) REFERENCES public.autores(id_autor) ON DELETE CASCADE,
	CONSTRAINT livro_autor_id_livro_fkey FOREIGN KEY (id_livro) REFERENCES public.livros(id_livro) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.livro_autor OWNER TO neondb_owner;
GRANT ALL ON TABLE public.livro_autor TO neondb_owner;


-- public.livro_genero definição

-- Drop table

-- DROP TABLE public.livro_genero;

CREATE TABLE public.livro_genero (
	id_livro int4 NOT NULL,
	id_genero int4 NOT NULL,
	CONSTRAINT livro_genero_pkey PRIMARY KEY (id_livro, id_genero),
	CONSTRAINT livro_genero_id_genero_fkey FOREIGN KEY (id_genero) REFERENCES public.generos(id_genero) ON DELETE CASCADE,
	CONSTRAINT livro_genero_id_livro_fkey FOREIGN KEY (id_livro) REFERENCES public.livros(id_livro) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.livro_genero OWNER TO neondb_owner;
GRANT ALL ON TABLE public.livro_genero TO neondb_owner;


-- public.multas definição

-- Drop table

-- DROP TABLE public.multas;

CREATE TABLE public.multas (
	id_multa serial4 NOT NULL,
	id_emprestimo int4 NOT NULL,
	dias_atraso int4 NOT NULL,
	valor_total numeric(10, 2) NOT NULL,
	pago bool DEFAULT false NULL,
	CONSTRAINT multas_id_emprestimo_key UNIQUE (id_emprestimo),
	CONSTRAINT multas_pkey PRIMARY KEY (id_multa),
	CONSTRAINT multas_id_emprestimo_fkey FOREIGN KEY (id_emprestimo) REFERENCES public.emprestimos(id_emprestimo)
);

-- Permissions

ALTER TABLE public.multas OWNER TO neondb_owner;
GRANT ALL ON TABLE public.multas TO neondb_owner;




-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;
ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT TRIGGER, SELECT, MAINTAIN, TRUNCATE, UPDATE, DELETE, REFERENCES, INSERT ON TABLES TO neon_superuser WITH GRANT OPTION;
ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO neon_superuser WITH GRANT OPTION;