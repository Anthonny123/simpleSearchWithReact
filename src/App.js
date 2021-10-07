import React, {useEffect, useState} from 'react'
import {Form, Card, Image, Icon, CardHeader} from 'semantic-ui-react'
import './App.css'
const {Octokit} = require("@octokit/core");

function App() {
  const octokit = new Octokit({auth:"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"})

  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [repos, setRepos] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([])


  const loadUsers = async()=>{
    const res = await octokit.request("GET /search/users",{
      q:`${userInput} in:login`
    }).then((e)=>{
      console.log(e.data.items)
      setUsers(e.data.items)
      //setData(e.data.items)
      console.log(userInput)
    })
    
  }

  useEffect(() => {
    /*fetch(`https://api.github.com/users`)
    .then(res => res.json())
    .then(data =>{
      setUsers(data)
      //setData(data)
      //console.log(data)
    })*/
    
    loadUsers();
  }, []);


  
  const setData = ({name, login, followers, following, public_repos, avatar_url}) =>{
    setName(name);
    setUsername(login);
    setFollowers(followers);
    setFollowing(following);
    setRepos(public_repos);
    setAvatar(avatar_url);
  }

  const handlerSearch = (e)=>{
    let matches = []
    if(e.length>0){
      matches = users.filter((user)=>{
        const regex = new RegExp(`${e}`, "gi")
        return user.login.match(regex)
      })
    }
    setUserInput(e)
    setSuggestions(matches)
  }


  const handleSubmit = ()=>{
    fetch(`https://api.github.com/users/${userInput}`)
      .then(res=> res.json())
      .then(data =>{
        if(data.message){
          setError(data.message)
        }else{
          setData(data)
          setUserInput('')
          setError(null);
        }
      })
  }

  const onSuggestionHandler = (text)=>{
    setUserInput(text)
    setSuggestions([]);
  }

  return (
    <div>
      <div className = "navbar">
        GitHub Search
      </div>
      <div className = "search">
        <Form onSubmit = {handleSubmit}>
          <Form.Group>
            <Form.Input placeholder='Github user' name='github user' 
              onChange = {e => {
                handlerSearch(e.target.value) 
                setUserInput(e.target.value)
                if(userInput.length>=3&&userInput.length<=8){
                  loadUsers()
                }
              }}
              value = {userInput}
            />
            
            <Form.Button content= 'Search'/>
          </Form.Group>
        </Form>
      </div>
      <div className = "list">
        {suggestions &&  suggestions.map((suggestion,i)=>
          <div key = {i} className = "suggestion"
          onClick = {()=> onSuggestionHandler(suggestion.login)}>{suggestion.login}</div>
        )}
      </div>
      {error ? (<h1 className = "card">{error}</h1>) : (<div className = "card">
        <Card>
          <Image
            src={avatar}
            wrapped ui={false}
          ></Image>

          <Card.Content>
            <Card.Header>{name}</Card.Header>
            <CardHeader>{userName}</CardHeader>
            </Card.Content>
            <Card.Content extra>
              <a href = {`https://github.com/${userName}?tab=followers`}>
                <Icon name='user' />
                {followers} Followers
              </a>
            </Card.Content>
            <Card.Content extra>
              <a href={`https://github.com/${userName}?tab=repositories`}>
                <Icon name='user' />
                {repos} Repos
              </a>
            </Card.Content>
            <Card.Content extra>
              <a href = {`https://github.com/${userName}?tab=following`}>
                <Icon name='user' />
                {following} Following
              </a>
            </Card.Content>
        </Card>
      </div>)}
      
    </div>
  );
}

export default App;
