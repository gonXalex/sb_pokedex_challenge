import axios from 'axios'
import { array, object, string, number } from 'yup';
import { Pokemon } from '@/types';
import { 
    Button, Input, FormControl, FormLabel, FormErrorMessage, RadioGroup, Stack, Radio,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper 
} from '@chakra-ui/react'
import { Formik, Form, Field } from 'formik'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
  AutoCompleteCreatable
} from "@choc-ui/chakra-autocomplete";
import { typeChart, statsObj } from '@/utils';
import { useState } from 'react';
import Modal from './modal';
 
type FormType = {
    title: string;
    type: "create" | "update"
    data: Pokemon | null
    token: string;
    handleCallback: (cb: boolean) => void
}
export default function PokemonForm({title, type, data, token, handleCallback}: FormType) {
    const [openModal, setOpenModal] = useState('');
    const axiosConfigHeaders = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    
    const types = typeChart();
    
    let initialValues = data || {
        name: '',
        number: 1,
        gender: '',
        imageUrl: '',
        type: [],
        weight: 0,
        abilities: [],
        hp: 1,
        def: 1,
        atk: 1,
        spdf: 1,
        spatk: 1,
        spd: 1,
    }
    
    let formValidationSchema = object({
        name: string().required("El nombre es requerido."),
        gender: string().required("Seleccione un género."),
        imageUrl: string().required("Agregue un URL de una imagen."),
        type: array().of(string()).min(1, 'Favor seleccionar al menos 1 tipo.')
        .required('Favor seleccionar al menos 1 tipo.'),
        weight: number().required().positive().required("Debe introducir el peso"),
        abilities: array().of(string()).min(1, 'Debe introducir al menos 1 habilidad.')
        .required('Debe introducir al menos 1 habilidad.'),
        hp: number().required().positive().integer().required("El HP es requerido"),
        atk: number().required().positive().integer().required("El Ataque es requerido"),
        def: number().required().positive().integer().required("La Defensa es requerida"),
        spatk: number().required().positive().integer().required("El Ataque Especial es requerido"),
        spdf: number().required().positive().integer().required("La Defensa Especial es requerida"),
        spd: number().required().positive().integer().required("La Velocidad es requerida"),
    });

    
    const handleToggleModal = (modalType: string) => {
      setOpenModal(ps => ps = modalType);
    }

    const handleSubmit = async (formValues: Pokemon) => {
        try {
            await formValidationSchema.validate(formValues, {abortEarly: false})
            const findTypesIds = formValues.type.map(tp => {
              const id = types.findIndex(ti => ti.type === tp)
              return id + 1
            });

            if(type === 'create') {
                axios.post('http://localhost:5244/pokemons', {...formValues, typeIds: findTypesIds}, axiosConfigHeaders).then(res => {
                  handleCallback(true)
                }).catch(() => {
                    console.log('error')
                })
                return
            }
            if(type === 'update' && data?.id) {
              axios.put(`http://localhost:5244/pokemons/${data.id}`, {...formValues, typeIds: findTypesIds}, axiosConfigHeaders).then(res => {
                    handleCallback(true)
                }).catch(() => {
                    console.log('error')
                })
            }
        }catch(err) {
            //
        }
    }

    // const user = await formValidationSchema.validate();
    return (
        <div className='max-w-[1200px] w-full'>
          <h1 className='text-[30px] text-[#041430] pb-6'>{title}</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={formValidationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className='grid grid-cols-2 gap-x-8 gap-y-6'>
                <Field name="name">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel>Nombre</FormLabel>
                            <Input {...field}  placeholder='Ej: Pikachu' />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="gender">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.gender && form.touched.gender}>
                            <FormLabel>Genero</FormLabel>
                            <RadioGroup {...field} name="gender">
                              <Stack direction='row'>
                                <Radio {...field} value='Masculino'>Masculino</Radio>
                                <Radio {...field}  value='Femenino'>Femenino</Radio>
                                <Radio {...field}  value='Ninguno'>Ninguno</Radio>
                              </Stack>
                            </RadioGroup>
                            <FormErrorMessage>{form.errors.gender}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="imageUrl">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.imageUrl && form.touched.imageUrl}>
                            <FormLabel>Imagen</FormLabel>
                            <Input {...field}  placeholder='Ej: https://image.pokemon/snorlax.png' />
                            <FormErrorMessage>{form.errors.imageUrl}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="type">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.type && form.touched.type}>
                            <FormLabel>{"Tipo(s)"}</FormLabel>
                            <AutoComplete value={form.values.type} onChange={(value: string[]) => setFieldValue('type', value)}  openOnFocus multiple maxSelections={2}>
                                <AutoCompleteInput variant="filled">
                                  {({ tags }) =>
                                    tags.map((tag, tid: number) => (
                                      <AutoCompleteTag
                                        key={tid}
                                        label={tag.label}
                                        onRemove={tag.onRemove}
                                      />
                                    ))
                                  }
                                </AutoCompleteInput>
                                <AutoCompleteList>
                                  {types.map((t, index) => (
                                    <AutoCompleteItem
                                      key={`option-${index}`}
                                      value={t.type}
                                      textTransform="capitalize"
                                    >
                                      {t.type}
                                    </AutoCompleteItem>
                                  ))}
                                </AutoCompleteList>
                              </AutoComplete>
                            <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="weight">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.weight && form.touched.weight}>
                            <FormLabel>Peso</FormLabel>
                              <NumberInput value={form.values.weight}  max={1025} min={1}>
                                <NumberInputField  {...field} />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            <FormErrorMessage>{form.errors.weight}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <Field name="abilities">
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.abilities && form.touched.abilities}>
                            <FormLabel>Habilidades</FormLabel>
                            <AutoComplete creatable value={form.values.abilities} onChange={(value: string[]) => setFieldValue('abilities', value)}  openOnFocus multiple maxSelections={2}>
                                <AutoCompleteInput variant="filled">
                                  {({ tags }) =>
                                    tags.map((tag, tid: number) => (
                                      <AutoCompleteTag
                                        key={tid}
                                        label={tag.label}
                                        onRemove={tag.onRemove}
                                      />
                                    ))
                                  }
                                </AutoCompleteInput>
                                <AutoCompleteList>
                                  {[].map((t, index) => (
                                    <AutoCompleteItem
                                      key={`option-${index}`}
                                      value={t}
                                      textTransform="capitalize"
                                      
                                    >
                                      {t}
                                    </AutoCompleteItem>
                                  ))}
                                  <AutoCompleteCreatable>
                                    {({ value }) => <p className='font-bold'>Agregar habilidad: <span className='font-normal'>{value}</span></p>}
                                  </AutoCompleteCreatable>
                                </AutoCompleteList>
                              </AutoComplete>
                            <FormErrorMessage>{form.errors.abilities}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <div className='col-span-2 grid grid-cols-6 gap-x-4'>
                  {
                    statsObj().map(so => (
                      <Field name={so.value} key={so.value}>
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors[so.value] && form.touched[so.value]} className='col-span-1'>
                                <FormLabel>{so.name}</FormLabel>
                                  <NumberInput value={form.values[so.value]} onChange={(value: string) => setFieldValue(so.value, Number(value))}   max={1025} min={1}>
                                    <NumberInputField  {...field} />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                <FormErrorMessage>{form.errors[so.value]}</FormErrorMessage>
                            </FormControl>
                        )}
                      </Field>
                    ))
                  }
                </div>
                <div className='col-span-2 flex justify-end items-center w-full'>
                  {
                    data?.dummy ?
                      <Button
                          mt={4}
                          colorScheme='blue'
                          isLoading={isSubmitting}
                          type={'button'}
                          onClick={() => handleToggleModal('deny')}
                      >
                          Devuelvase
                      </Button>
                    :

                      <Button
                          mt={4}
                          colorScheme='blue'
                          isLoading={isSubmitting}
                          type={'submit'}
                      >
                          Guardar
                      </Button>
                  }
                </div>
              </Form>
            )}
          </Formik>
          <Modal open={openModal === 'deny'} title={"Denegado"} toggle={() => handleToggleModal('')}>
              <div>
                <p className='text-[24px] font-normal'>
                  Los Pokemon de placeholder no se pueden modificar, favor agregar algunos a la BD!
                </p>
                <div className='col-span-2 flex justify-end items-center w-full'>
                    <Button
                        mt={4}
                        colorScheme='blue'
                        type='button'
                        onClick={() => handleToggleModal('')}
                    >
                        Cerrar
                    </Button>
                </div>
              </div>
          </Modal>
        </div>
    )
}