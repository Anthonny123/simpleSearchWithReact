import React, {useEffect, useState} from 'react'
import {Form, Card, Image, Icon, CardHeader} from 'semantic-ui-react'
import './App.css'

function App() {
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


  useEffect(() => {
    fetch(`https://api.github.com/users`)
    .then(res => res.json())
    .then(data =>{
      setUsers(data)
      //setData(data)
      console.log(data)
    })
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
    setSuggestions(matches)
    setUserInput(e)
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
    console.log(text)
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
              onChange = {e => handlerSearch(e.target.value)}
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
              <Card.Meta>

              </Card.Meta>
              <Card.Description>
                
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                {followers} Followers
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='user' />
                {repos} Repos
              </a>
            </Card.Content>
            <Card.Content extra>
              <a>
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
