import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const userExist = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExist) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const { id, name, email, store } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      store,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação Falhou' });
    }

    const { email, oldPassword } = req.body;

    // const user = await User.findByPk(req.userId);
    const user = await User.findOne({
      where: { email },
    });

    if (email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });
      if (userExist) {
        return res.status(400).json({ error: 'Usuário já cadastrado. ' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha não corresponde.' });
    }

    const { id, name, store } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      store,
    });
  }
}

export default new UserController();
