import { useState } from "react";
import { useQuery,useMutation } from "@tanstack/react-query";
import axios from 'axios'
function App(){
  const[inp,setInp]=useState("")
  const[id,setId]=useState(null)
  const {data,refetch}=useQuery({
    queryKey:["todos"],
    queryFn:async()=>{
      let response=await axios.get("http://localhost:3000/toDo")
      return response.data
    }
  })
  const AddMutation=useMutation({
    mutationFn:async({task})=>{
      await axios.post("http://localhost:3000/toDo",{task})
    },
    onSuccess:()=>{
      refetch()
      setInp("")
    }
  })
  const Emutation=useMutation({
    mutationFn:async({task,id})=>{
      await axios.patch(`http://localhost:3000/toDo/${id}`,{task})
    },
    onSuccess:()=>{
      refetch()
      setInp("")
      setId("")
    }
  })
  const Dmutation=useMutation({
    mutationFn:async(id)=>{
      await axios.delete(`http://localhost:3000/toDo/${id}`)
    },
    onSuccess:()=>{
      refetch()
    }
  })
  return(
    <>
    <input value={inp}
    placeholder="enter something..."
    onChange={(e)=>setInp(e.target.value)}
    />
    <button onClick={()=>AddMutation.mutate({task:inp})}>add</button>
    <button onClick={()=>Emutation.mutate({task:inp,id})}>update</button>
    {data?.map((i)=>(
      <div key={i.id}>
        <h3>{i.task}</h3>
        <button onClick={()=>{
          setInp(i.task)
          setId(i.id)
        }}>edit</button>
       <button onClick={()=>Dmutation.mutate(i.id)}>delete</button>
      </div>
    ))}
    </>
  )
}
export default App