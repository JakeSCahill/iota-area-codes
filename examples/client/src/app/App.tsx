import "iota-css-theme";
import { Footer, GoogleAnalytics, Header, LayoutAppSingle, SideMenu, StatusMessage } from "iota-react-components";
import React, { Component, ReactNode } from "react";
import { Link, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import logo from "../assets/logo.svg";
import contentHomePage from "../content/contentHomePage.json";
import { ServiceFactory } from "../factories/serviceFactory";
import { IConfiguration } from "../models/config/IConfiguration";
import { ConfigurationService } from "../services/configurationService";
import { TangleExplorerService } from "../services/tangleExplorerService";
import { AppState } from "./AppState";
import Conversion from "./routes/Conversion";
import Server from "./routes/Server";

/**
 * Main application class.
 */
class App extends Component<RouteComponentProps, AppState> {
    /**
     * The configuration for the app.
     */
    private _configuration?: IConfiguration;

    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isBusy: true,
            status: "Loading Configuration...",
            statusColor: "info",
            isSideMenuOpen: false
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        try {
            const configService = new ConfigurationService<IConfiguration>();
            const configId = process.env.REACT_APP_CONFIG_ID || "local";
            const config = await configService.load(`/data/config.${configId}.json`);

            ServiceFactory.register("configuration", () => configService);
            ServiceFactory.register("tangleExplorer", () => new TangleExplorerService(config.tangleExplorer));

            this._configuration = config;

            this.setState({
                isBusy: false,
                status: "",
                statusColor: "success"
            });
        } catch (err) {
            this.setState({
                isBusy: false,
                status: err.message,
                statusColor: "danger"
            });
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <React.Fragment>
                <Header
                    title="IOTA Area Codes"
                    topLinks={contentHomePage.headerTopLinks}
                    logo={logo}
                    compact={true}
                    hamburgerClick={() => this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen })}
                    hamburgerMediaQuery="tablet-up-hidden"
                />
                <nav className="tablet-down-hidden">
                    <Link className="link" to="/">Conversion</Link>
                    <Link className="link" to="/server">Server</Link>
                </nav>
                <SideMenu
                    isMenuOpen={this.state.isSideMenuOpen}
                    handleClose={() => this.setState({ isSideMenuOpen: false })}
                    history={this.props.history}
                    items={[
                        {
                            name: "IOTA Area Codes",
                            isExpanded: true,
                            items: [
                                {
                                    items: [
                                        {
                                            name: "Conversion",
                                            link: "/"
                                        },
                                        {
                                            name: "Server",
                                            link: "/server"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]}
                    selectedItemLink={this.props.location.pathname}
                    mediaQuery="tablet-up-hidden"
                />
                <section className="content">
                    <LayoutAppSingle>
                        <StatusMessage status={this.state.status} color={this.state.statusColor} isBusy={this.state.isBusy} />
                        {!this.state.status && (
                            <Switch>
                                <Route exact={true} path="/" component={() => (<Conversion hash={Date.now()} />)} />
                                <Route exact={true} path="/server" component={() => (<Server hash={Date.now()} />)} />
                        </Switch>
                        )}
                    </LayoutAppSingle>
                </section>
                <Footer history={this.props.history} sections={contentHomePage.footerSections} staticContent={contentHomePage.footerStaticContent} />
                <GoogleAnalytics id={this._configuration && this._configuration.googleAnalyticsId} />
            </React.Fragment>
        );
    }
}

export default withRouter(App);