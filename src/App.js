import React from "react"
import { v4 as uuidv4} from 'uuid'
import {BrowserRouter as Router, Route} from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header"
import FeedbackData from "./data/FeedbackData"
import FeedbackList from "./components/FeedbackList"
import FeedbackStats from "./components/FeedbackStats"
import FeedbackForm from "./components/FeedbackForm"
import AboutPage from "./pages/AboutPage"

function App(){

    const [feedback, setFeedback] = useState(FeedbackData)

    const addFeedback = (newFeedback) => {
        newFeedback.id = uuidv4()
        setFeedback([newFeedback, ...feedback])
    } 

    const deleteFeedback = (id) => {
        if(window.confirm('Are you sure you want to delete?')){
           setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    return (
        <Router>
        <Header />
        <div className='container'>
            
                
                    <FeedbackForm handleAdd={addFeedback}></FeedbackForm>
                    <FeedbackStats feedback={feedback}/>
                    <FeedbackList feedback={feedback} handleDelete={deleteFeedback}/>
               
            
            
            {/* <Route path='/about' Component={AboutPage}>This is route Page</Route> */}
        
        </div>
        </Router>
         
    )
}

export default App