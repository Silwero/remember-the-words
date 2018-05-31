import './HeaderNav.css';

import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export class HeaderNav extends Component {
	state = {
		links: {
			addTranslation: {
				url: '/add-translation',
				placeholder: 'Add translation',
				authOnly: true,
				unAuthOnly: false
			},
			myTranslations: {
				url: '/my-translations',
				placeholder: 'My translations',
				authOnly: true,
				unAuthOnly: false
			},
			training: {
				url: '/training',
				placeholder: 'Еraining',
				authOnly: true,
				unAuthOnly: false,
				subnav: {
					logout: {
						url: '/choose-correct',
						placeholder: 'Сhoose correct'
					}
				}
			},
			auth: {
				url: '/auth',
				placeholder: 'Register / Login',
				authOnly: false,
				unAuthOnly: true
			},
			settings: {
				placeholder: 'User Name',
				authOnly: true,
				unAuthOnly: false,
				subnav: {
					// settings: {
					// 	url: '/settings',
					// 	placeholder: 'Settings',
					// },
					logout: {
						url: '/logout',
						placeholder: 'Logout'
					}
				}
			}
		}
	}

	render() {
		let newLinks = [];

		for (let link in this.state.links) {
			if ( (this.state.links[link].authOnly && !this.props.isAuth) || (this.state.links[link].unAuthOnly && this.props.isAuth) ) {
				continue;
			}

			if (this.state.links[link].subnav) {

				let subnav = [];
				for (let subLink in this.state.links[link].subnav) {
					subnav.push(
						<NavLink key={this.state.links[link].subnav[subLink].placeholder} exact to={this.state.links[link].subnav[subLink].url}>
							{this.state.links[link].subnav[subLink].placeholder}
						</NavLink>
					)
				}


				newLinks.push(<li key={this.state.links[link].placeholder} className="has-sub">
					<div className="header-nav-link">{link === 'settings' ? this.props.userName : this.state.links[link].placeholder}</div>
					<div className="subnav">
						{subnav}
					</div>
				</li>);
			} else {
				newLinks.push(<li key={this.state.links[link].placeholder} >
					<NavLink className="header-nav-link" exact to={this.state.links[link].url}>
							{this.state.links[link].placeholder}
						</NavLink>
				</li>)
			}
		}

		return (
			<nav>
				<ul className="header-nav">
					{newLinks}
				</ul>
			</nav>
		);
	}
}

const mapStateToProps = state => {
  return {
    isAuth: state.isAuth,
    userName: state.userInfo.displayName
  }
}

export default withRouter(connect(mapStateToProps)(HeaderNav));
