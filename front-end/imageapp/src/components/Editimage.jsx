import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col, Form, Alert,ProgressBar } from 'react-bootstrap';
import axios from "axios";
import { useHistory } from "react-router-dom";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export default function Editimage(props) {
    console.log("pppppppp ", props.selectimage)


    const history = useHistory();


    const [image, setimage] = useState(props.selectimage)
    const [urlimage,seturlimage]=useState(props.selectimage.image)
    const [successfully, setsuccessfully] = useState(true)
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChangeInput = ({ target: { name, value } }) => {
        setimage({ ...image, [name]: value });
        console.log(name, " ", value);



    };


    const uploadImage = async e => {

        
        const options = {
            onUploadProgress: progressEvent => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                    setUploadPercentage(percent);
                }
            },
        };


        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        console.log('file', files[0])
        data.append('upload_preset', 'xvn0ezmv')
        axios.post('https://api.cloudinary.com/v1_1/duuconncq/image/upload', data, options)
            .then(res => {
                console.log("res", res)
                var file = res.data

                setUploadPercentage(100);
                setTimeout(() => {
                    setUploadPercentage(0);
                }, 1000);

              
                
                setimage({ ...image, image: file.secure_url });

                

            }).catch(err => {
                 console.log(err) 
                 setUploadPercentage(0);
                })


    }

    const onSubmit = (event) => {
        image.user = props.data._id;
        event.preventDefault();
        axios.put(`http://localhost:4000/api/Image/EditImage/${props.selectimage._id}`, image)
            .then((res) => {
                setsuccessfully(false);
                setTimeout(() => {

                    history.push("/Profile");
                    setsuccessfully(true);
                }, 1500);
            })

    };


    return (
        <div>
        <Container style={{ marginTop: "5%", marginRight: "15%" }}>
            <Row>
                <Col>
                    <img src="https://res.cloudinary.com/duuconncq/image/upload/v1624046012/bunjvww6cuq6tj20gew5.gif" alt="" />
                </Col>
                <Col>
                    {!successfully && (
                        <Alert variant="success">Successfully Edit  <CheckCircleIcon /></Alert>
                    )}

                    <Form>

                        <Form.Group className="mb-3" controlId="formBasicEmail77">
                            <Form.Label>title</Form.Label>
                            <Form.Control type="text" name="title" defaultValue={props.selectimage.title} placeholder="Enter Title" onChange={onChangeInput} />
                        </Form.Group>




                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Upload the image</Form.Label><br/>
                            <Form.Control type="file"   placeholder="image" onChange={uploadImage} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail" hidden>
                            <Form.Label>Upload the image</Form.Label><br/>
                            <Form.Control type="text" name="image" value={urlimage}  placeholder="image" onChange={onChangeInput} />
                        </Form.Group>
                        {uploadPercentage > 0 && (
                        <ProgressBar
                          now={uploadPercentage}
                          striped={true}
                          label={`${uploadPercentage}%`}
                        />
                      )}







                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" defaultValue={props.selectimage.description} placeholder="Enter the Description" rows={3} onChange={onChangeInput} />
                        </Form.Group>




                        <Button variant="primary" type="submit" onClick={onSubmit}>
                            Submit
                        </Button>
                    </Form>

                </Col>
            </Row>
        </Container>
    </div>
    )
}
