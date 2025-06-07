import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterUserMutation } from '../users/usersApiSlice';
import { setCredentials } from '../auth/authSlice'; // Import the authentication action
import { useLoginMutation } from '../auth/authApiSlice'; // Import the login mutation
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Alert, 
  Divider,
  Card,
  Tooltip,
  Layout
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  CheckCircleFilled, 
  CloseCircleFilled,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content, Footer } = Layout;

const Register = () => {
    const [form] = Form.useForm();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    
    // Validation states
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isUniqueEmail, setIsUniqueEmail] = useState(true);
    const [isUniqueUsername, setIsUniqueUsername] = useState(true);
    const [isStrongPassword, setIsStrongPassword] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading: isRegistering }] = useRegisterUserMutation();
    const [login, { isLoading: isLoggingIn }] = useLoginMutation(); // Add login mutation hook

    // clear error message field on form values change
    useEffect(() => {
        setErrMsg('');
    }, [email, username, password]);

    // Validate email (institutional email check)
    useEffect(() => {
        const isInstitutional = /.+\.(edu|gov|org)$/.test(email);
        setIsValidEmail(email ? isInstitutional : null);
    }, [email]);

    // Validate password
    useEffect(() => {
        // Password must be at least 8 characters, contain a number, uppercase, and special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        setIsStrongPassword(password ? passwordRegex.test(password) : null);
    }, [password]);

    const handleSubmit = async (values) => {
        // Validate all requirements before submitting
        if (!isValidEmail || !isStrongPassword) {
            setErrMsg('Please meet all registration requirements');
            return;
        }

        try {
            // Register the user
            const registrationResult = await register({
                email: values.email,
                username: values.username,
                password: values.password
            }).unwrap();

            // Automatically log in after successful registration
            try {
                const loginResult = await login({
                    identifier: values.username, 
                    password: values.password
                }).unwrap();
                
                // Store user credentials in Redux store
                dispatch(setCredentials({
                    user: loginResult.username,
                    token: loginResult.accessToken
                }));
                
                // Reset form and redirect to success page
                form.resetFields();
                setEmail('');
                setUsername('');
                setPassword('');
                navigate('');
            } catch (loginError) {
                // If login fails, still navigate to success page, but without auto-login
                console.error('Auto-login failed:', loginError);
                navigate('');
            }
        }
        catch (err) {
            // Display error message
            if (!err.status) {
                setErrMsg('No server response.');
            }
            else if (err.status === 400) {
                setErrMsg('Missing required fields.');
            }
            else if (err.status === 401) {
                setErrMsg('Unauthorized');
            }
            else if (err.status === 409) {
                console.log('409');
                if (err.data.duplicateUsername) {
                    setIsUniqueUsername(false);
                    form.setFields([
                        {
                            name: 'username',
                            errors: ['Username already exists']
                        }
                    ]);
                }
                if (err.data.duplicateEmail) {
                    setIsUniqueEmail(false);
                    form.setFields([
                        {
                            name: 'email',
                            errors: ['Email is already in use']
                        }
                    ]);
                }
            }
            else if (err.data?.message?.includes('email')) {
                setErrMsg('Invalid email format');
                setIsValidEmail(false);
                form.setFields([
                    {
                        name: 'email',
                        errors: ['Invalid email format']
                    }
                ]);
            }
            else if (err.data?.message?.includes('password')) {
                setErrMsg('Password does not meet security requirements');
                setIsStrongPassword(false);
                form.setFields([
                    {
                        name: 'password',
                        errors: ['Password does not meet security requirements']
                    }
                ]);
            }
            else {
                setErrMsg(err.data?.message || 'Registration failed');
            }
        }
    };

    const emailValidation = {
        validateStatus: isValidEmail === null ? '' : (isValidEmail ? 'success' : 'error'),
        hasFeedback: email !== '',
    };
    
    const usernameValidation = {
        validateStatus: isUniqueUsername === null ? '' : (isUniqueUsername ? 'success' : 'error'),
        hasFeedback: username !== '',
    };
    
    const passwordValidation = {
        validateStatus: isStrongPassword === null ? '' : (isStrongPassword ? 'success' : 'error'),
        hasFeedback: password !== '',
    };

    const isLoading = isRegistering || isLoggingIn;

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 16px' }}>
                <Card 
                    bordered={false}
                    style={{ 
                        width: '100%',
                        maxWidth: 400,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)'
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2} style={{ fontWeight: 300, marginBottom: 8 }}>Create Account</Title>
                        </div>

                        {errMsg && (
                            <Alert
                                message={errMsg}
                                type="error"
                                showIcon
                                closable
                                onClose={() => setErrMsg('')}
                            />
                        )}

                        <Form
                            form={form}
                            layout="vertical"
                            name="register"
                            onFinish={handleSubmit}
                            requiredMark={false}
                            initialValues={{ email: '', username: '', password: '' }}
                        >
                            <Form.Item
                                name="email"
                                label={
                                    <Space>
                                        <span>Email</span>
                                        <Tooltip title="Must be an institutional email (.edu, .gov, .org)">
                                            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                                        </Tooltip>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Please enter your email address' },
                                    { type: 'email', message: 'Please enter a valid email address' }
                                ]}
                                {...emailValidation}
                            >
                                <Input
                                    prefix={<MailOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                                    placeholder="albert@ufl.edu"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsUniqueEmail(true);
                                    }}
                                    suffix={email && (
                                        isValidEmail 
                                            ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                                            : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item
                                name="username"
                                label={
                                    <Space>
                                        <span>Username</span>
                                        <Tooltip title="Username must be unique">
                                            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                                        </Tooltip>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Please enter a username' },
                                    { min: 3, message: 'Username must be at least 3 characters' }
                                ]}
                                {...usernameValidation}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                                    placeholder="Username"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setIsUniqueUsername(true);
                                    }}
                                    suffix={username && (
                                        isUniqueUsername 
                                            ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                                            : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                                    )}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={
                                    <Space>
                                        <span>Password</span>
                                        <Tooltip title="Must contain 8+ characters, uppercase, number, and special character">
                                            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                                        </Tooltip>
                                    </Space>
                                }
                                rules={[
                                    { required: true, message: 'Please enter a password' }
                                ]}
                                {...passwordValidation}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    suffix={password && (
                                        isStrongPassword 
                                            ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                                            : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                                    )}
                                />
                            </Form.Item>

                            {password && !isStrongPassword && (
                                <Form.Item>
                                    <Alert
                                        message="Password requirements"
                                        description={
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                <li>At least 8 characters</li>
                                                <li>At least one uppercase letter</li>
                                                <li>At least one number</li>
                                                <li>At least one special character (!@#$%^&*)</li>
                                            </ul>
                                        }
                                        type="info"
                                        showIcon
                                    />
                                </Form.Item>
                            )}

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    disabled={!isValidEmail || !isUniqueEmail || !isUniqueUsername || !isStrongPassword}
                                    block
                                    style={{ 
                                        height: '40px',
                                        backgroundColor: '#000',
                                        borderColor: '#000'
                                    }}
                                >
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider plain>or</Divider>

                        <div style={{ textAlign: 'center' }}>
                            <Space direction="vertical" size="small">
                                <Text>
                                    Already have an account? <Link to="/login">Sign in</Link>
                                </Text>
                                <Link to="/">
                                    <Button type="link" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Back to Home</Button>
                                </Link>
                            </Space>
                        </div>
                    </Space>
                </Card>
            </Content>
            <Footer style={{ textAlign: 'center', background: '#fff' }}>
                <Text type="secondary">© {new Date().getFullYear()} Your Company</Text>
            </Footer>
        </Layout>
    );
};

export default Register;