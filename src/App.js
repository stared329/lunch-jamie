import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  fetchPeople,
  addPerson,
  deletePerson,
  groupingPeople
} from './modules/lunch'

import Lunch from './components/Lunch'

import './App.css'

const mapDispatchToProps = dispatch => (
  {
    onAdd(name) {
      dispatch(addPerson(name))
    },
    onDelete(id) {
      dispatch(deletePerson(id))
    },
    onGrouping(num) {
      dispatch(groupingPeople(num))
    },
    onFetch() {
      dispatch(fetchPeople())
    }
  }
)

const mapStateToProps = state => {
  return {
    people: state.lunch.people.people,
    error: state.lunch.people.error,
    isSaving: state.lunch.people.saving
  }
}

class App extends React.Component {
  static propTypes = {
    people: PropTypes.array.isRequired
  }

  componentDidMount() {
    this.props.onFetch();
  }

  render () {
    const {
      people, error, onDelete, onAdd, onGrouping
    } = this.props

    return (
      <section className="container">
        <Lunch people={people}
        error={error} 
        addPerson={onAdd}
        deletePerson={onDelete}
        groupingPeople={onGrouping}
        grclass="col-xs-6 col-xs-offset-3" />
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
