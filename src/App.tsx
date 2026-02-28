import { useState, useEffect } from "react"
import { Sidebar } from "./SideBar/SideBar";
import { BASE_URL } from "./contacts";
import type { ICountryShort, ICountry } from "./types"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  const [countriesList, setcountriesList] = useState<ICountryShort[]>([])
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)

  useEffect(()=>{
    const getCountries = async() => {
      try{
        const response = await fetch(`${BASE_URL}/all?fields=alpha3Code,name`)
        if (!response.ok) {
          throw new Error
        }
        const data:ICountryShort[] = await response.json()
        setcountriesList(data)
      }catch(e) {
        console.log(e)
      }
    }
    getCountries()
  },[])



  const getCountryByCode = async (code:string) => {
    try {
      const response = await fetch(`${BASE_URL}/alpha/${code}`)
      if (!response.ok) {
        throw new Error
      }
      const data: ICountry = await response.json()
      setSelectedCountry(data)
    } catch (e) {
      console.log(e)
    }
  }  



  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar countries={countriesList} onSelect={getCountryByCode}/>

      <Box component="main" sx={{ flexGrow: 2, p: 3, ml: '300px' }}>
        {selectedCountry ? (
          <Box>
            <Typography variant="h3" gutterBottom>{selectedCountry.name}</Typography>
            <img src={selectedCountry!.flag} alt="flag" style={{ width: '150px', borderRadius: '6px' }} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              capital: {selectedCountry.capital}
            </Typography>
            <Typography variant="body1">
                population: {selectedCountry.population.toLocaleString()}
            </Typography>

            <Typography 
              variant="h4" sx={{mt: 3}}>
                border:
            </Typography>

            {selectedCountry.borders ? (
              <Box component="ul">
                {selectedCountry.borders.map(border => (
                  <Typography component="li" key={border}>
                    {border}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography>there are no land borders</Typography>
            )}
          </Box>
        ) : (
          <Typography variant="h4">
            choose a country from the list on the left
          </Typography>
        )}
      </Box>
    </Box>
  )         
}





export default App