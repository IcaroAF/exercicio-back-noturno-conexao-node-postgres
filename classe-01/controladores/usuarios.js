const conexao = require("../conexao");

const listarUsuarios = async (req, res) => {
  try {
    const { rows: usuarios } = await conexao.query("SELECT * FROM usuarios");

    for (const usuario of usuarios) {
      const { rows: livros } = await conexao.query(
        "SELECT * FROM livros WHERE autor_id = $1",
        [usuario.id]
      );
      usuario.livros = livros;
    }

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await conexao.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuário não encontrado");
    }

    return res.status(200).json(usuario.rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarUsuario = async (req, res) => {
  const { nome, idade, email, telefone, cpf } = req.body;

  if (!nome) {
    return res.status(400).json("O campo nome é obrigatório");
  }

  if (!email) {
    return res.status(400).json("O campo email é obrigatório");
  }

  if (!cpf) {
    return res.status(400).json("O campo cpf é obrigatório");
  }

  try {
    const query =
      "INSERT INTO usuarios (nome, idade, email, telefone, cpf) VALUES($1, $2, $3, $4, $5)";
    const usuario = await conexao.query(query, [
      nome,
      idade,
      email,
      telefone,
      cpf,
    ]);

    if (usuario.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o usuario");
    }

    return res.status(200).json("Usuário cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;

  try {
    const usuario = await conexao.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuário não encontrado");
    }

    if (!nome) {
      return res.status(400).json("O campo nome é obrigatório.");
    }

    const query = "UPDATE usuarios SET nome = $1, idade = $2 WHERE id = $3";
    const autorAtualizado = await conexao.query(query, [nome, idade, id]);

    if (autorAtualizado.rowCount === 0) {
      return res.status(400).json("Não foi possível atualizar o usuario");
    }

    return res.status(200).json("Usuário atualizado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await conexao.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuário não encontrado");
    }

    const query = "DELETE FROM usuarios WHERE id = $1";
    const autorRemovido = await conexao.query(query, [id]);

    if (autorRemovido.rowCount === 0) {
      return res.json("Não foi possível excluir o usuario.");
    }

    return res.status(200).json("Usuário removido com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario,
};
