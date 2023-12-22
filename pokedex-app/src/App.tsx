import { useEffect, useState } from 'react'
import { Button, Input } from '@chakra-ui/react'
import { pokemonDb } from './utils/tempDb'
import Card from './components/card';
import Modal from './components/modal';
import PokemonForm from './components/pokemonForm';
import AuthForm from './components/authForm';
import { Pokemon, User } from './types';
import PokemonDetail from './components/pokemonDetail';
import { LockIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import axios from 'axios'
import './App.css'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [actionType, setActionType] = useState<"create" | "update">('create');
  const [openModal, setOpenModal] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [pokemons, setPokemons]= useState<Pokemon[] | []>([])
  const [searchQuery, setSearchQuery]= useState('')
  const [openDetail, setOpenDetail] = useState(false);
  const handleSelectPokemon = (pokemon?: Pokemon) => {
    if(pokemon) {
      setSelectedPokemon(pokemon)
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
    setOpenDetail(ps => !ps)
  }
  const handleToggleModal = (modalType: string) => {
    setOpenModal(ps => ps = modalType);
  }
  const handleCreate = () => {
    setActionType("create");
    handleToggleModal('poke-form');
  }
  const handleEdit = () => {
    setActionType("update");
    handleToggleModal('poke-form');
  }
  const handleCallback = (data: User) => {
    setUser(data)
    handleToggleModal('')
  }
  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    handleToggleModal('')
  }
  const handleFetchPokemons = (isCallback?: boolean) => {
    axios.get('http://localhost:5244/pokemons')
    .then(res => {
        if(res.data?.data?.length) {
            const formattedData = res.data?.data.map((d: Pokemon) => {
              return {
                ...d,
                type: d.pokemonTypes?.map(pt => pt.typeName) || []
              }
            })
            setPokemons(formattedData)
            handleToggleModal('')
            if(isCallback) handleToggleModal('success')
        }else {
          setPokemons(pokemonDb())
        }
    })
  }

  const filteredData = pokemons.filter((item) => searchQuery ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : pokemons);
  useEffect(() => {
    handleFetchPokemons()
    // Use localstorage logic, for simplicity.
    const userData = localStorage.getItem("user")
    if(!user && userData) {
      const paresData = JSON.parse(userData)
      if(paresData) setUser(paresData)
    }
  }, []);
  return (
    <>
      <div className='container m-auto grid grid-cols-3 gap-y-8 gap-x-8 pt-8'>
        <div className='flex col-span-3 justify-end'>
          <button 
            type='button' 
            className='bg-[#e5e5e5] shadow-sm py-2 px-4 rounded-md flex justify-between items-center gap-x-4 uppercase'
            onClick={() => user ? handleToggleModal('confirm-logout') : handleToggleModal('auth-form')}
          >
            {
              user ? 
              <>
                <p>{user.name}</p>
                <ArrowForwardIcon w={4} h={4} />
              </>
              :
              <>
                <p>Autenticarse</p>
                <LockIcon w={4} h={4} />
              </>
            }
          </button>
        </div>
          <div className='flex col-span-3 xl:col-span-2 justify-between items-center'>
            <h1 className='text-[50px] text-[#3a4c6d] font-bold'>Pokedex Nacional</h1>
            {
              user &&
              <button 
                type='button' 
                onClick={handleCreate} 
                className='text-[16px] font-semibold bg-red-700 text-white rounded-[10px] p-2 w-[100px] shadow-md uppercase'
              >
                Crear +
              </button>
            }
          </div>
          <div className='grid col-span-3 xl:col-span-2 content-start'>
            <Input 
              placeholder='Busca algún pokemon!' size='lg' variant='filled' 
              colorScheme='white' bg="white" className='w-full shadow-lg mb-20' 
              onChange={e => setSearchQuery(ps => ps = e.target.value)}
            />
            <div className='grid grid-cols-3 gap-x-4 gap-y-16 '>
              {
                filteredData.length ? filteredData.map((pokemon, index) => (
                  <button 
                    type="button" 
                    key={`${pokemon.number}-${index}`} 
                    className='col-span-1'
                    onClick={() => handleSelectPokemon(pokemon)}
                  >
                    <Card pokemon={pokemon} />
                  </button>
                )) : null
              }
            </div>
          </div>
          
          <div 
            className={`absolute w-full h-full flex top-0 left-0 z-[8] bg-black/40 ${openDetail ? 'block' : 'hidden'} xl:hidden`} 
            onClick={() => setOpenDetail(ps => !ps)} 
          />
          {
            selectedPokemon ?
              <div className={`absolute ${openDetail ? 'translate-y-0' : '-translate-y-[1400px]'} transition-transform duration-[500ms] xl:translate-y-0 max-w-[490px] left-[calc(50%-245px)] top-[10%] z-[9] xl:z-0 xl:max-w-full xl:static grid col-span-1 w-full`}>
                <PokemonDetail isLogged={Boolean(user)} pokemon={selectedPokemon} handleEdit={handleEdit} />
              </div> 
            :
              null
          }
      </div>
      <Modal open={openModal === 'poke-form'} title={actionType === 'update' ? "Actualizar" : "Crear"} toggle={() => handleToggleModal('')}>
          <PokemonForm 
            data={actionType === 'update' ? selectedPokemon : null}
            title={actionType === 'update' ? "Modifica los atributos!" : "Agrega tu Pokemon!"}
            type={actionType}
            token={user?.token || ''}
            handleCallback={handleFetchPokemons}
          />
      </Modal>

      <Modal open={openModal === 'auth-form'} title={"Autenticación"} toggle={() => handleToggleModal('')}>
          <AuthForm 
            type="login"
            handleCallback={handleCallback}
          />
      </Modal>

      <Modal open={openModal === 'confirm-logout'} title={"Confirmación"} toggle={() => handleToggleModal('')}>
          <div>
            <p className='text-[25px] font-normal'>
              ¿Desea proceder a cerrar sesión?
            </p>
            <div className='col-span-2 flex justify-end items-center w-full'>
                <Button
                    mt={4}
                    colorScheme='blue'
                    type='button'
                    onClick={() => handleLogout()}
                >
                    Confirmar
                </Button>
            </div>
          </div>
      </Modal>
      <Modal open={openModal === 'success'} title={"Exito"} toggle={() => handleToggleModal('')}>
          <div>
            <p className='text-[25px] font-normal'>
              Operación completada exitosamente
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
    </>
  )
}

export default App
