import { useEffect, useState } from 'react'
import { string, ref, object } from 'yup';
import { 
    Input, FormControl, FormLabel, FormErrorMessage, Tab, TabList, TabPanels, Tabs, Button
} from '@chakra-ui/react'
import { Formik, Form, Field, } from 'formik'
import axios from 'axios'
import { User } from '@/types';

type AuthType = {
    title?: string;
    type: "login" | "register";
    handleCallback: (data: User) => void;
}

type FormTypes = {
    username: string;
    password: string;
    confirm_password: string;
}

function Login() {
    return(
        <>
            <Field name="username">
                {({ field, form }) => (
                    <FormControl isInvalid={form.errors.username && form.touched.username}>
                        <FormLabel>Usuario</FormLabel>
                        <Input {...field}  placeholder='Ej: Juan01' />
                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
            <Field name="password">
                {({ field, form }) => (
                    <FormControl isInvalid={form.errors.password && form.touched.password}>
                        <FormLabel>Contraseña</FormLabel>
                        <Input {...field} type="password" placeholder='******' />
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
        </>
    )
}

export default function AuthForm({ type, handleCallback }: AuthType) {
    const [authType, setAuthType] = useState(type === 'login' ? 0 : 1)
    const [validationSchema, setValidationSchema] = useState(
        object().shape({
            username: string().notRequired(),
            password: string().notRequired(),
        })
    );
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    let initialValues =  {username: '', password: '', confirm_password: ''}
    const handleTabSelect = (index: number, resetForm: ()=> void) => {
        resetForm();
        setAuthType(ps => ps = index);
    }
    const handleSubmit = async (formValues: FormTypes, login?: boolean) => {
        try {
            const proceed = await validationSchema.validate(formValues, {abortEarly: false})
            if(authType === 0 || login) {
                axios.post('http://localhost:5244/api/auth/login', formValues).then(res => {
                    if(res.data) {
                        const toJsonData = JSON.stringify(res.data);
                        localStorage.setItem("user", toJsonData);
                        handleCallback(res.data);
                    }
                }).catch(() => {
                    console.log('error')
                })
                return
            }
            if(authType === 1) {
                axios.post('http://localhost:5244/api/auth/register', formValues).then(res => {
                    handleSubmit(formValues, true)
                }).catch(() => {
                    console.log('error')
                })
            }
        }catch(err) {
            //
        }
    }

    useEffect(() => {
        let updatedSchema;
        if (authType === 1) {
          updatedSchema = object().shape({
            username: string().required('El usuario es requerido'),
            password: string().required('La contraseña es requerida').matches(
            passwordRegex,
            'La contraseña debe contener al menos 1 mayúscula, 1 minúscula, 1 caracter especial y tener al menos 6 caracteres'
            ),
            confirm_password: string()
              .oneOf([ref('password'), null], 'Las contraseñas deben coincidir')
              .required('Confirme su contraseña'),
          });
        } else {
          updatedSchema = object().shape({
            username: string().required('El usuario es requerido'),
            password: string().required('La contraseña es requerida')
          });
        }
    
        setValidationSchema(updatedSchema);
    }, [authType]);
    return(
        <div className='max-w-[650px] w-full'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ isSubmitting, resetForm }) => (
                <Form className='gap-x-8 gap-y-6'>
                    <Tabs isFitted onChange={(index) => handleTabSelect(index, resetForm)}>
                        <TabList mb='1em'>
                            <Tab>Login</Tab>
                            <Tab>Regisro</Tab>
                        </TabList>
                        <TabPanels className='flex flex-col gap-y-4'>  
                            <Login />
                            {
                                authType === 1 &&
                                <Field name="confirm_password">
                                    {({ field, form }) => (
                                        <FormControl isInvalid={form.errors.confirm_password && form.touched.confirm_password}>
                                            <FormLabel>Contraseña</FormLabel>
                                            <Input {...field} type="password" placeholder='******' />
                                            <FormErrorMessage>{form.errors.confirm_password}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                            }
                        </TabPanels>
                    </Tabs>
                    <div className='col-span-2 flex justify-end items-center w-full'>
                        <Button
                            mt={4}
                            colorScheme='blue'
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Confirmar
                        </Button>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
    )
}