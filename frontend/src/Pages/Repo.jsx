
import axios from 'axios'
import { useState } from 'react'
const Repo = () => {
  const [reponame, setreponame] = useState("")
 async function submitreponame(e){

  e.preventDefault()
  const response=await axios.post('http://localhost:3000/repo/init',{

    name:reponame
  }
  )
  if(response){
    console.log(response.data)   
  }
  

 }


  return (
    <div className="w-full h-screen">
        <div className='w-[30%] bg-amber-200 h-full flex flex-col gap-4 items-center justify-center'>
          <input className="bg-gray-100 text-2xl " type="text" value={reponame} 
          onChange={(e)=>setreponame(e.target.value)}
          />
          <button
          onClick={submitreponame}
          className="bg-green-500 items-center justify-center px-3 py-4 text-2xl rounded-2xl "
          >create repo</button>
        </div>

          
        <div>
          
            
        </div>
    </div>
  )
}

export default Repo