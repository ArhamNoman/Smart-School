import React, { Component } from 'react';
import {Route,Switch} from 'react-router'
import {Table, InputGroup, Row, Col } from 'react-bootstrap'
import { 
    Card,
    Spinner,
    OverlayTrigger,
    Tooltip,
    Button,
    Container,
    Breadcrumb,
    Modal,
    Form
} from 'react-bootstrap';
import { FaEye,FaTrashAlt,FaPlus} from "react-icons/fa";
import { Input, ModalHeader } from 'semantic-ui-react';
import axios from "axios"


const ip = 'localhost'

class StudentsTab extends Component {
  
  state = {
    studentData: [],
    studentDataBackup: [],
    selectAll: false,
    view:{
        id: '',
        isview: false
    },
    edit:{
        id: '',
        isEdit: false
    },
    add_showmodal:false,
    add_studentid: null,
    add_class: '',
    add_section: '',
    add_gender: '',
    add_name: '',
    add_pname: '',
    add_pcontact: '',
    add_pemail: '',
    delete_last_deleted: {},
    delete_last_deleted_id: null,
    delete_showmodal: false,
    adding: false,
    Search: ''
}


componentDidMount(){
    //Extract data 
    let resp;
    axios.post("http://localhost:8080/students","ack").then((res) => {
        
        //Make all check false
          this.setState({
              studentData: res.data.students,
              studentDataBackup : res.data.students
          })
    }).catch((e) => console.log(e))
    
}


handleChangeCheckbox = (e) => {
  console.log(e)
}

handleDeleteModalClose = () =>{
  
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal = false
  this.setState(prevState)
} 

handleDeleteModalShow = () =>{
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal = true
  this.setState(prevState)
} 

handleViewModalClose = () =>{
  var prevState = Object.assign({},this.state)
  prevState.view.isview = false
  this.setState(prevState)
} 

handleViewModalShow = (ev) =>{
  var prevState = Object.assign({},this.state)
  prevState.view.isview = true
  this.setState(prevState)
} 

handleDelete = (e) => {

  e.preventDefault()

  this.get_student(this.state.delete_last_deleted_id, (fObject) => {

      var prevState = Object.assign({},this.state)
      prevState.delete_last_deleted = fObject 
      this.setState(prevState, () => {
          let del_Obj = {
              name:fObject.name
          }
  
      axios.post("http://localhost:8080/deleteStudent",del_Obj).then((res) => {
          // var prevState = Object.assign({},this.state)
          // prevState.facultyData = this.state.facultyData.filter((f) => f.facultyid !== del_Obj.facultyid && f.email !== del_Obj.email)
          // this.setState(prevState)
          var prevState = Object.assign({},this.state)
          let fd = prevState.studentData
          fd = fd.filter((f) => f.name !== fObject.name)
          prevState.studentData = fd
          this.setState(prevState)
          this.handleDeleteModalClose()
      }).catch((e) => console.log(e))

      })
  })

  
}

get_student(id,cb) {
  let count = 0
  this.state.studentData.forEach(f => {
      if(f.name===id && count<1)
      {
          count = count + 1
          console.log(f)
          cb(f)
      }
  });
}

handleDeleteTid = (e,id)  =>{
  var prevState = Object.assign({},this.state)
  prevState.delete_showmodal=true
  prevState.delete_last_deleted_id = id
  this.setState(prevState)
}

handleView = () => {

  //this.handleViewModalShow()
  //this.handleViewModalClose()
}

handleAddModalClose = () =>{
  var prevState = Object.assign({},this.state)
  prevState.add_showmodal = false
  this.setState(prevState)
}

handleAddModalShow = () =>{
  var prevState = Object.assign({},this.state)
  prevState.add_showmodal = true
  this.setState(prevState)
}

handleSubmitAddStudent = (e) => {
  e.preventDefault()
  let obj = this.state
      let studentInfo = {

          "studentid": 1,
          "name": obj.add_name,
          "pcontact": obj.add_pcontact,
          "gender": obj.add_gender,
          "pemail": obj.add_pemail,
          "section": obj.add_section,
          "theclass": obj.add_class,
          "pname": obj.add_pname,
      }

      console.log(studentInfo)
      axios.post("http://localhost:8080/registerStudent",studentInfo).then((res)=>{
          console.log(res.data.message)
          if(res.data.message === "Success")
          {
              var prevState = Object.assign({},this.state)
              prevState.add_showmodal = false
              prevState.add_class= ''
              prevState.add_section= ''
              prevState.add_gender= ''
              prevState.add_name= ''
              prevState.add_pcontact= ''
              prevState.add_pemail= ''
              prevState.add_pname= ''
              let fd = prevState.studentData
              fd.push(studentInfo)
              prevState.studentData = fd
              this.setState(prevState)
          }
          else{
              alert("Something went Wrong!")
          }


      }).catch((e) => console.log(e))
}

handleEdit = () => {

}

handleAddInputs = (ev) => {
  ev.preventDefault()
  let {name,value} = ev.target
  console.log(name,value)
  var prevState = Object.assign({},this.state)
  prevState[name] = value
  this.setState(prevState)
}

handleSearch = (e) => {
  e.preventDefault()
  this.setState({Search:e.target.value}, ()=>{
      console.log(this.state.Search)
      let tempvalue = this.state.Search 
      this.setState((prevState) => {
              return {studentData: prevState.studentDataBackup.filter((f)=> f.name.toLowerCase().includes(tempvalue.toLowerCase()))}
      })
  })
  
  
}


  render() {
    return (
      <div>
        <h1>Students Information</h1>
        <div>
                {/* BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item>Admin</Breadcrumb.Item>
                    <Breadcrumb.Item active>View Students</Breadcrumb.Item>
                </Breadcrumb>


                {/* Delete Modal */}
                <Modal
                    show={this.state.delete_showmodal}
                    onHide={this.handleDeleteModalClose}
                    size="sm"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleDeleteModalClose}>No</Button>
                        <Button variant="danger" onClick={this.handleDelete}>Yes</Button>
                    </Modal.Footer>
                </Modal>


                {/* View/Edit Model */}
                <Modal
                    show={this.state.view.isview}
                    onHide={this.handleViewModalClose}
                    size="sm"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Student Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            this.getFaculty()
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleViewModalClose}>Close</Button>
                        <Button variant="danger" onClick={this.handleView}>Edit</Button>
                    </Modal.Footer>
                </Modal>

                {/* Add Faculty */}
                <Modal
                    show={this.state.add_showmodal}
                    size="md"
                    centered
                >
                    <Modal.Header> 
                        <Modal.Title>Add Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={this.handleSubmitAddStudent}>
                                    <div>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter Student Name"
                                                name="add_name"
                                                value={this.state.add_name}
                                                onChange={this.handleAddInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control
                                             required
                                             name="add_gender"
                                             value={this.state.add_gender}
                                             onChange={this.handleAddInputs}
                                             as="select"
                                             >
                                                <option>Gender...</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </Form.Control>
                                            </Form.Group>

                                           
                                        </Form.Row>

                                        <Form.Row>

                                            <Form.Group as={Col}>
                                            <Form.Control
                                             name="add_class"
                                             value={this.state.add_class}
                                             onChange={this.handleAddInputs}
                                             as="select">
                                                <option>Class...</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                            </Form.Control>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                            <Form.Control 
                                             name="add_section"
                                             value={this.state.add_section}
                                             onChange={this.handleAddInputs}
                                            as="select">
                                                <option>Section...</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                            </Form.Control>
                                            </Form.Group>
                                        </Form.Row>

                                        <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Enter Parent's Name"
                                                name="add_pname"
                                                value={this.state.add_pname}
                                                onChange={this.handleAddInputs}
                                                />
                                            </Form.Group>
                                           
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Control
                                                name="add_pemail"
                                                value={this.state.add_pemail}
                                                onChange={this.handleAddInputs}
                                                required
                                                type="email"
                                                placeholder="Parent's Email"
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Control
                                                 name="add_pcontact"
                                                 value={this.state.add_pcontact}
                                                 onChange={this.handleAddInputs}
                                                required
                                                type="text"
                                                placeholder="Enter Parent's Contact"
                                                />
                                            </Form.Group>


                                        </Form.Row>

                                        <Button type="submit" ><FaPlus/> Add </Button>
                                        </div>
                                </Form>
                            </Card.Body>
                        </Card> 
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleAddModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>


                <br/>


                {/* Search Box and Add Faculty */}
                <div style={{display: 'flex', "margin": "20px"}}>
                     <span style={{justifyContent:"flex-start"}}><Input type="text" value={this.state.Search} onChange={this.handleSearch} placeholder="Search Student name"></Input></span>
                     <span  style={{justifyContent:"flex-end"}}><Button onClick={this.handleAddModalShow}> <FaPlus/> Add</Button></span>
                </div>   



                {/* Table */}
                <Table responsive hover>
                    <thead>
                        <th><InputGroup.Checkbox checked={this.state.selectAll} onChange={this.handleChangeSelectAll}/></th>
                        <th> id</th>
                        <th> Name</th>
                        <th> Class-Section </th>
                        <th>     </th>
                    </thead>
                    <tbody>

                        {
                            this.state.studentData.map(({section,theclass,name},id) => 
                                <tr key={id}>
                                    <td><InputGroup.Prepend><InputGroup.Checkbox /> </InputGroup.Prepend> </td>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{`${theclass}-${section}`}</td>
                                    <td></td>
                                    <td>
                                        {/* <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">View/Edit</Tooltip>}>
                                            <span className="d-inline-block"> */}
                                                <Button variant="success" onClick={this.handleView}> <FaEye/> View/Edit</Button>
                                                <Button variant="danger" onClick={(e) => this.handleDeleteTid(e,name)}> <FaTrashAlt/> Delete</Button>
                                            {/* </span>
                                            </OverlayTrigger> */}
                                    </td>
                                    
                                </tr>
                            )

                        }

                    </tbody>
                </Table>

            </div>
      </div>
    );
  }
}

export default StudentsTab;