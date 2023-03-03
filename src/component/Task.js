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

export default class Task extends React.Component {

    state = {
        tasks: [],
        id: '',
        description: '',
        dueDate: '',
        assignee: '',
        status: '',
        selectedRow: {},
        setSelectedRow: {}
    }

    populateRow = (row) => {
        this.setState({ selectedRow: row })
        this.setState({ id: row.id });
        this.setState({ description: row.description });
        this.setState({ dueDate: row.dueDate });
        this.setState({ assignee: row.assignee });
        this.setState({ status: row.status });

    };

    handleSelectRow = (row, status) => {
        this.setState({ selectedRow: row })
        this.setState({ description: row.description });
        this.setState({ dueDate: row.dueDate });
        this.setState({ assignee: row.assignee });
        this.setState({ status: row.status });

        if (status === "unassign") {
            this.handleUnassign(row);
        } else if (status === "reassign") {
            this.handleReassign(row);
        }

    };

    setDescription = event => {
        this.setState({ description: event.target.value });
    }

    setDuedate = event => {
        this.setState({ dueDate: event.target.value });
    }

    setAssignee = event => {
        this.setState({ assignee: event.target.value });
    }

    setStatus = event => {
        this.setState({ status: event.target.value });
    }

    handleSubmit = (event) => {

        event.preventDefault();
        const task = {
            description: this.state.description,
            dueDate: this.state.dueDate,
            assignee: this.state.assignee
        };

        const taskBody = JSON.stringify(task);
        const customConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Axios.post(`/task/assign`, taskBody, customConfig)
            .then(res => {
                console.log(res.data);
                this.componentDidMount();
            }).catch(err => {
                console.log("exception>>>>>>>>>>" + err);
            });
    }

    handleUnassign = (event) => {
        this.handleStatus(event, `/task/unassign`, "UNASSIGNED");
    }

    handleReassign = (event) => {
        this.handleStatus(event, `/task/reassign`, "ASSIGNED");
    }

    handleUpdate = () => {

        const task = {
            id: this.state.id,
            description: this.state.description,
            dueDate: this.state.dueDate,
            assignee: this.state.assignee,
        };

        const taskBody = JSON.stringify(task);
        const customConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Axios.put(`/task/edit`, taskBody, customConfig)
            .then(res => {
                console.log(res.data);
                this.componentDidMount();
            });
    }

    handleStatus = (row, uri, status) => {
        const task = {
            id: row.id,
            description: row.description,
            dueDate: row.dueDate,
            assignee: row.assignee,
            status: status
        };

        const taskBody = JSON.stringify(task);
        const customConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Axios.put(uri, taskBody, customConfig)
            .then(res => {
                console.log(res.data);
                this.componentDidMount();
            });
    }

    componentDidMount() {
        Axios.get(`/task/all`)
            .then(res => {
                const tasks = res.data.payload;
                this.setState({ tasks: tasks });
            })
    }

    render() {
        return (
            <div className='App' >
                <Container>
                    <Row>
                        <Col sm={8}>
                            <Row>
                                <h1 className='PageTitle'>Manage Task</h1>

                                <div className='inputContainer'>
                                    <Stack direction="horizontal" gap={3}>
                                        <div>
                                            <Form onSubmit={this.handleSubmit}>
                                                <FormGroup role="form">
                                                    <Stack direction="vertical" gap={2}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control disabled value={this.state.id} className="me-auto" placeholder="id" />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control value={this.state.description} className="me-auto" placeholder="Description" onChange={this.setDescription} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control value={this.state.dueDate} className="me-auto" placeholder="Due Date" onChange={this.setDuedate} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Control value={this.state.assignee} className="me-auto" placeholder="Assignee" onChange={this.setAssignee} />
                                                        </Form.Group>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Button variant='success' className='btnContainer' type="submit">Assigne</Button>
                                                        </Stack>
                                                    </Stack>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                    </Stack>
                                </div>
                            </Row>
                            <Row>
                                <Col>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Description</th>
                                                <th>Due Date</th>
                                                <th>Assignee</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tasks.map((task, index) => {
                                                    return (
                                                        <tr key={index} onClick={() => this.populateRow(task)} className={this.state.selectedRow === task ? 'selected' : ''}>
                                                            <td>{task.id}</td>
                                                            <td>{task.description}</td>
                                                            <td>{task.dueDate}</td>
                                                            <td>{task.assignee}</td>
                                                            <td>{task.status}</td>
                                                            <td><Button variant='danger' className='btnContainer' onClick={() => this.handleSelectRow(task, "unassign")}>Unassign</Button></td>
                                                            <td><Button variant='success' className='btnContainer' onClick={() => this.handleSelectRow(task, "reassign")}>Reassign</Button></td>
                                                            <td><Button variant='warning' className='btnContainer' onClick={() => this.handleUpdate()}>Edit</Button></td>
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