import { useState } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { useAuth } from "../context/AuthContext"

// Mot de passe : au moins 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

const registerSchema = yup.object({
    username: yup
        .string()
        .required("Le nom d'utilisateur est obligatoire")
        .min(4, "Le nom d'utilisateur doit avoir au moins 4 caractères"),
    password: yup
        .string()
        .required("Le mot de passe est obligatoire")
        .min(8, "Le mot de passe doit avoir au moins 8 caractères")
        .matches(
            passwordRegex,
            "Le mot de passe doit contenir une minuscule, une majuscule, un chiffre et un caractère spécial"
        ),
    email: yup
        .string()
        .required("L'email est obligatoire")
        .email("L'email est invalide"),
    firstname: yup
        .string()
        .required("Le prénom est obligatoire"),
    lastname: yup
        .string()
        .required("Le nom est obligatoire"),
    gender: yup
        .string(),
    avatar: yup
        .string()
        .transform((value) => (value ? value : undefined))
        .url("L'URL de l'avatar est invalide"),
})

function RegisterPage() {
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [formError, setFormError] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            firstname: "",
            lastname: "",
            gender: "",
            avatar: "",
        },
    })

    const onSubmit = async (data) => {
        setFormError("")

        try {
            await registerUser(data)
            // Compte de démo local uniquement : il ne permet pas de se connecter
            // (login() utilise la vraie API DummyJSON). On renvoie donc vers /login.
            navigate("/login", { state: { registered: true, from: location.state?.from } })
        } catch (error) {
            setFormError(error.message)
        }
    }

    return (
        <div className="auth-shell">
            <Card className="auth-card border-0">
                <Row className="g-0">
                    <Col md={5} className="d-none d-md-flex">
                        <div className="auth-visual">
                            <span className="auth-visual-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" y1="8" x2="19" y2="14" />
                                    <line x1="22" y1="11" x2="16" y2="11" />
                                </svg>
                            </span>
                            <p className="hero-eyebrow text-white-50 fw-bold mb-2">Bienvenue</p>
                            <h2 className="font-display fw-bold">Créez votre carnet de voyage</h2>
                            <p className="mb-0 opacity-75">
                                Rejoignez la communauté et commencez à préparer vos prochaines découvertes.
                            </p>
                        </div>
                    </Col>
                    <Col md={7}>
                        <Card.Body className="p-4 p-md-5">
                            <h1 className="font-display fw-bold mb-4">Créer un compte</h1>

                            {formError && <Alert variant="danger">{formError}</Alert>}

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="firstname" className="mb-3">
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Votre prénom"
                                                isInvalid={!!errors.firstname}
                                                {...register("firstname")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstname?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group controlId="lastname" className="mb-3">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Votre nom"
                                                isInvalid={!!errors.lastname}
                                                {...register("lastname")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastname?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Nom d'utilisateur</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Votre nom d'utilisateur"
                                        isInvalid={!!errors.username}
                                        {...register("username")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Votre email"
                                        isInvalid={!!errors.email}
                                        {...register("email")}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Votre mot de passe"
                                        isInvalid={!!errors.password}
                                        {...register("password")}
                                    />
                                    <Form.Text muted>
                                        Au moins 8 caractères, avec une minuscule, une majuscule, un chiffre et un caractère spécial.
                                    </Form.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col sm={6}>
                                        <Form.Group controlId="gender" className="mb-3">
                                            <Form.Label>Genre (optionnel)</Form.Label>
                                            <Form.Select isInvalid={!!errors.gender} {...register("gender")}>
                                                <option value="">Non précisé</option>
                                                <option value="Femme">Femme</option>
                                                <option value="Homme">Homme</option>
                                                <option value="Autre">Autre</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.gender?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group controlId="avatar" className="mb-3">
                                            <Form.Label>Avatar (optionnel)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="https://..."
                                                isInvalid={!!errors.avatar}
                                                {...register("avatar")}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.avatar?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button type="submit" className="btn-gradient w-100 mt-2" disabled={isSubmitting}>
                                    Créer mon compte
                                </Button>
                            </Form>

                            <p className="mt-4 mb-0 text-center">
                                Déjà un compte ?{" "}
                                <Link to="/login" state={location.state}>
                                    Se connecter
                                </Link>
                            </p>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default RegisterPage
