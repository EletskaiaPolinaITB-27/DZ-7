import { useState, useEffect } from "react"
import { SideBar } from "./SideBar/SideBar";
import { BASE_URL } from "./contacts";
import type { ICountryShort, ICountry } from "./types"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  const [countriesList, setcountriesList] = useState<ICountryShort[]>([])
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const [borderNames, setBorderNames] = useState<string[]>([]);

  useEffect(()=>{
    const getCountries = async() => {
      try{
        const response = await fetch(`${BASE_URL}/all?fields=alpha3Code,name`)
        if (!response.ok) {
          throw new Error('fail to load list')
        }

        const data:ICountryShort[] = await response.json()
        setcountriesList(data)
      } catch(e) {
      }
    };

    getCountries()
  },[]);



  const getCountryByCode = async (code:string) => {
    try {
      const response = await fetch(`${BASE_URL}/alpha/${code}`)
      if (!response.ok) {
        throw new Error('fail to load country')
      }
      const data: ICountry = await response.json()
      setSelectedCountry(data)
    } catch (e) {
    }
  };
  
   useEffect(() => {
    const loadBorders = async () => {
      if (!selectedCountry?.borders?.length) {
        setBorderNames([]);
        return;
      }

      try {
        const names = await Promise.all(
          selectedCountry.borders.map(async (code) => {
            const res = await fetch(`${BASE_URL}/alpha/${code}?fields=name`);
            if (!res.ok) throw new Error("Failed to load border country");
            const data: { name: string } = await res.json();
            return data.name;
          })
        );

        setBorderNames(names);
      } catch (e) {
        console.log(e);
        setBorderNames([]);
      }
    };

      loadBorders();
  }, [selectedCountry]);



  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar countries={countriesList} onSelect={getCountryByCode}/>

      <Box component="main" sx={{ flexGrow: 2, p: 3, ml: '300px' }}>
        {selectedCountry ? (
          <Box>
            <Typography variant="h3" gutterBottom>
            {selectedCountry.name}
            </Typography>

            <img 
            src={selectedCountry!.flag} 
            alt="flag" 
            style={{ width: '150px', borderRadius: '6px' }} />


            <Typography variant="body1" sx={{ mt: 2 }}>
              capital: {selectedCountry.capital}
            </Typography>

            <Typography variant="body1">
                population: {selectedCountry.population.toLocaleString()}
            </Typography>

            <Typography variant="body1" sx={{mt: 3}}>
                border:
            </Typography>

            
            {borderNames.length ? (
              <Box component="ul">

                {borderNames.map((name) => (
                  <Typography component="li" key={name}>
                    {name}
                  </Typography>
                ))}

              </Box> 
              ) : (
              <Typography>
                there are no land borders
              </Typography>
            )}
          </Box> ) : (
          <Typography variant="h4">
            choose a country from the list on the left
          </Typography>
        )}
      </Box>
    </Box>
  )         
}





export default App