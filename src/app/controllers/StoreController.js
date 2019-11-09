import * as Yup from 'yup';
import Store from '../models/Store';
import User from '../models/User';

class StoreController {
  async index(req, res) {
    const stores = await Store.findAll();

    return res.json(stores);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      telefone: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const checkUser = await User.findOne({
      where: { id: req.body.user_id, store: true },
    });

    if (!checkUser) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para cadastrar uma loja.' });
    }

    const loja = await Store.create({
      name: req.body.name,
      email: req.body.email,
      telefone: req.body.telefone,
      user_id: req.body.user_id,
    });

    return res.json(loja);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      telefone: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const checkUser = await User.findOne({
      where: { id: req.body.user_id, store: true },
    });

    const store = await Store.findByPk(req.body.id);

    if (!checkUser) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para cadastrar uma loja.' });
    }

    if (store.user_id !== req.body.user_id) {
      return res.status(401).json({ error: 'Loja não pertence ao usuário.' });
    }

    const loja = await store.update(req.body);

    return res.json(loja);
  }

  async delete(req, res) {
    const store = await Store.findByPk(req.params.id);

    if (store.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para excluir loja' });
    }

    // Store.destroy({ where: { id: id}})
    await store.destroy();

    return res.json({ message: 'Lojá exluída com sucesso.' });
  }
}

export default new StoreController();
