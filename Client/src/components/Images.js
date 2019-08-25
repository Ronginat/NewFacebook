import React, { Component } from 'react';
import './Images.scss';
import { FaBackspace } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";

class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: null
        };
        this.baseUrl = 'http://localhost/newFacebook/images/uploads/';
    }

    expandImg = (i) => {
        if (this.props.disableScreen) {
            return;
        }
        this.props.changeScreenAbility();
        this.setState({ expand: i })
    }

    closeExpand = () => {
        this.props.changeScreenAbility();
        this.setState({ expand: null })
    }

    swithcImg = (side) => {
        const expand = this.state.expand;
        if ((side === 'right' && expand === this.props.imgs.length - 1) || (side === 'left' && expand === 0)) {
            return;
        }
        this.setState({ expand: side === 'right' ? expand + 1 : expand - 1 })
    }

    render() {
        return (
            <div className="images">
                {this.props.imgs.map((img, i) => (
                    <div key={i} className="image" style={{ backgroundImage: `url(${this.baseUrl}${img})` }} onClick={() => this.expandImg(i)} />
                ))}
                {this.state.expand !== null &&
                    <div className="expandedImg" style={{ backgroundImage: `url(${this.baseUrl}${this.props.imgs[this.state.expand]})` }} >
                        <div className="closeExpandWrapper">
                            <FaBackspace
                                style={{ height: '30px', width: '30px', position: 'absolute', top: '6px', right: '6px', background: 'white', border: '3px solid black', padding: '2px' }}
                                onClick={this.closeExpand}
                            />
                            <FaAngleRight
                                style={{ height: '30px', width: '30px', position: 'absolute', top: '335px', right: '6px', background: 'white', border: '3px solid black', padding: '2px' }}
                                onClick={() => this.swithcImg('right')}
                            />
                            <FaAngleLeft
                                style={{ height: '30px', width: '30px', position: 'absolute', top: '335px', left: '6px', background: 'white', border: '3px solid black', padding: '2px' }}
                                onClick={() => this.swithcImg('left')}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Images;