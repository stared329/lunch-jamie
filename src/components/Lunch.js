import React from 'react'
import { findDOMNode } from 'react-dom';

export default class Lunch extends React.Component {
    render() {
        const { people, deletePerson, addPerson, groupingPeople, error } = this.props;
        const removeNode = name => {
            deletePerson(name);
        }
        const addNode = name => {
            addPerson(name);
        }
        const grouping = num => {
            groupingPeople(num);
        }
        return (
            <div className="well well-sm">
                <div className="row vert-offset-top-0">
                    <h1 className="col-sm-12">Lunch</h1>
                </div>
                <div className="row vert-offset-top-2">
                    <div className="col-xs-8 col-sm-6">
                        <PeopleList data={people} removeNode={removeNode} />
                    </div>
                    <div className="cols-xs-4 col-sm-6">
                        <PersonForm onAddSubmit={addNode} error={error}/>
                        <GroupMakeForm onSubmit={grouping} people={people} error={error}/>
                    </div>
                </div>
            </div>
        );
    }
}

class PeopleList extends React.Component{
    render() {
        const { data, removeNode } = this.props;
        const removePerson = name => {
            removeNode(name);
            return;
        }
        console.log(data);
        const listNodes = data.map(function (listItem, idx) {
            return (
                <PersonItem key={idx} personname={listItem.name} group={listItem.group} removeNode={removePerson} />
            );
        }, this);
        return (
            <ul className="list-group">
                {listNodes}
            </ul>
        );
    }
};

class PersonItem extends React.Component{
    render() {
        const { personname, group, removeNode } = this.props;
        const removePerson = e => {
            e.preventDefault();
            removeNode(personname);
            return;
        }
        return (
            <li className="list-group-item clearfix">
                <strong>{personname}</strong>
                <span style={{paddingLeft: '2em'}}>{(group) ? `group: ${group}` : ''}</span>
                <div className="pull-right" role="group">
                    <button type="button" className="btn btn-danger btn-xs" onClick={removePerson}>&#xff38;</button>
                </div>
            </li>
        );
    }
};

class PersonForm extends React.Component {
    state = {
        textValue: ''
    }

    changeText = e => {
        if(e) return this.setState({ textValue: e.target.value });
        this.setState({ textValue: ''});
    }

    render() {
        const { onAddSubmit, error } = this.props;
        const { textValue } = this.state;
        const doSubmit = e => {
            e.preventDefault();
            const personName = textValue;
            if (!personName) return;
            onAddSubmit(personName);
            this.changeText();
            const node = findDOMNode(this.refs.person);
            node.value = '';
            return;
        }
        return (
            <div className="commentForm">
                <div className="clearfix">
                    <form onSubmit={doSubmit}>
                        <div className="form-group col-md-12">
                            <label htmlFor="person" className="control-label">점심을 함께하고 싶다면 이름을 추가하세요.</label>
                            <div className="col-md-9">
                                <input type="text" id="person" ref="person" className="form-control" placeholder="write your name" onChange={this.changeText}/>
                            </div>
                            <div className="col-md-3">
                                <input type="submit" value="Add" className="btn btn-primary btn-md btn-block" />
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    {
                        (error && !textValue) && (
                            <div className="alert alert-danger" role="alert"><strong>{error}</strong></div>
                        )
                    }
                </div>
            </div>

        );
    }
};
class GroupMakeForm extends React.Component {
    state = {
        alertMsg: '',
        isGrouped: false,
    }

    changeInput = e => {
        const inputNum = e.target.value;
        const peopleNum = this.props.people.length;
        if(inputNum <= 1)
            this.setState({ alertMsg: `그룹은 2명 이상부터 만들 수 있습니다.` }); 
        else if(inputNum > peopleNum)
            this.setState({ alertMsg: `그룹 인원이 총 인원보다 많습니다. ${peopleNum}명 보다 작은 인원으로 그룹을 만드세요.` }); 
        else if (peopleNum % inputNum === 1)
            this.setState({ alertMsg: `${inputNum}명으로 그룹을 만들면 혼자 먹는 사람이 생겨요.` }); 
        else
            this.setState({ alertMsg: ''}); 
    }

    render() {
        const { onSubmit } = this.props;
        const { alertMsg, isGrouped } = this.state;
        const doSubmit = e => {
            e.preventDefault();
            const node = findDOMNode(this.refs.group);
            if(isGrouped) {
                node.value = '';
                onSubmit(0);
                return;
            }
            if (alertMsg) return;
            onSubmit(node.value);
            this.setState({ isGrouped: true });
            return;
        }
        return (
            <div className="commentForm">
                <hr />
                <div className="clearfix">
                    <form onSubmit={doSubmit}>
                        <div className="form-group col-md-12">
                            <label htmlFor="person" className="control-label">점심을 함께 할 인원을 정하고 그룹을 만드세요.</label>
                            <div className="col-md-9">
                                <input type="number" id="gruop" ref="group" className="form-control" onChange={this.changeInput} disabled={isGrouped} />
                            </div>
                            <div className="col-md-3">
                                <input type="submit" value={isGrouped?'Ungroup':'Submit'} className="btn btn-primary btn-md btn-block" />
                            </div>
                            <div className="center-block">
                            {
                                (alertMsg) && (
                                    <div className="col-md-10 alert alert-danger" role="alert"><strong>{alertMsg}</strong></div>
                                )
                            }
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        );
    }
};