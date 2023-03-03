import React from 'react';
import './../App.css';
import Axios from '../Axios';

import { Button } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import FormGroup from 'react-bootstrap/FormGroup';

export default class Employee extends React.Component {

    state = {
        employees: [],
        name: ''
    }

    handleChange = event => {
        this.setState({ name: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const employee = {
            name: this.state.name
        };

        const empBody = JSON.stringify(employee);
        const customConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Axios.post(`/employee/add`, empBody, customConfig)
            .then(res => {
                console.log(res.data);
                this.componentDidMount();
            }).catch(err => {
                console.log("exception>>>>>>>>>>" + err);
            });
    }

    componentDidMount() {
        Axios.get(`/employee/all`)
            .then(res => {
                const employees = res.data.payload;
                this.setState({ employees });
            })
    }

    render() {
        return (
            <div className='App'>
                <Container>
                    <Row>
                        <Col sm={8}>
                            <Row>
                                <h1 className='PageTitle'>Register Employee</h1>

                                <div className='inputContainer'>
                                    <Col sm={12}>
                                        <Stack direction="horizontal" gap={3}>
                                            <div>
                                                <Form onSubmit={this.handleSubmit}>
                                                    <FormGroup role="form">
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Form.Control className="me-auto" placeholder="Employee Name"
                                                                onChange={this.handleChange} />
                                                            <Button className='btnContainer' type="submit">Register</Button>
                                                        </Stack>
                                                    </FormGroup>
                                                </Form>
                                            </div>
                                        </Stack>
                                    </Col>
                                </div>
                            </Row>
                            <Row>
                                <Col>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Employee Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.employees.map((employee, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{employee.id}</td>
                                                            <td>{employee.name}</td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}