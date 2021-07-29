const conexao = require("../conexao");

const listarEmprestimos = async (req, res) => {
  try {
    const { rows: emprestimos } = await conexao.query(
      `SELECT e.id, u.nome as usuario, u.telefone, u.email, l.nome as livro, e.status FROM emprestimos e
      LEFT JOIN usuarios u on e.usuario_id = u.id
      LEFT JOIN livros l on e.livro_id = l.id 
      `
    );

    return res.status(200).json(emprestimos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    const emprestimo = await conexao.query(
      `SELECT e.id, u.nome as usuario, u.telefone, u.email, l.nome as livro, e.status FROM emprestimos e
      LEFT JOIN usuarios u on e.usuario_id = u.id
      LEFT JOIN livros l on e.livro_id = l.id WHERE e.id = $1 
      `,
      [id]
    );

    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Empréstimo não encontrado");
    }

    return res.status(200).json(emprestimo.rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarEmprestimo = async (req, res) => {
  const { usuario_id, livro_id, status } = req.body;

  if (!usuario_id) {
    return res.status(400).json("O campo usuario_id é obrigatório");
  }

  if (!livro_id) {
    return res.status(400).json("O campo livro_id é obrigatório");
  }

  try {
    const query =
      "INSERT INTO emprestimos (usuario_id, livro_id ) VALUES ($1, $2)";
    const emprestimo = await conexao.query(query, [usuario_id, livro_id]);

    if (emprestimo.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o empréstimo");
    }

    return res.status(200).json("Empréstimo cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarEmprestimo = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const emprestimo = await conexao.query(
      "SELECT * FROM emprestimos WHERE id = $1",
      [id]
    );

    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Empréstimo não encontrado.");
    }

    if (!status) {
      return res.status(400).json("O campo status é obrigatório");
    }

    const query = "UPDATE emprestimos SET status = $1 WHERE id = $2";
    const emprestimoAtualizado = await conexao.query(query, [status, id]);

    if (emprestimoAtualizado.rowCount === 0) {
      return res.status(400).json("Não foi possível atualizar o empréstimo");
    }

    return res.status(200).json("Empréstimo atualizado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirEmprestimo = async (req, res) => {
  const { id } = req.params;

  try {
    const emprestimo = await conexao.query(
      "SELECT * FROM emprestimos WHERE id = $1",
      [id]
    );

    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Empréstimo não encontrado");
    }

    const query = "DELETE FROM emprestimos WHERE id = $1";
    const emprestimoRemovido = await conexao.query(query, [id]);

    if (emprestimoRemovido.rowCount === 0) {
      return res.json("Não foi possível excluir o empréstimo.");
    }

    return res.status(200).json("Empréstimo removido com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarEmprestimos,
  obterEmprestimo,
  cadastrarEmprestimo,
  atualizarEmprestimo,
  excluirEmprestimo,
};
