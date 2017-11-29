import React, { Component } from 'react'import { StyleSheet, View, Text, TouchableWithoutFeedback, Image } from 'react-native'import { MapView, Marker, MapSearch, PlanDrive } from 'react-native-amap3d'const dimensions = require('Dimensions')const screenWidth = dimensions.get('window').widthconst screenHeight = dimensions.get('window').heightexport default class Drive extends Component {    static navigationOptions = {        title: '线路规划'    }    constructor(props) {        super(props)        this.state = {            showMark: false,            showDrive: false,            coordinates: {latitude: 0, longitude: 0},            locationCoor:{latitude: 0, longitude: 0},            address: '长按地图选点',            total: 0        }    }    render() {        return(            <View style = {{flex: 1}}>                <MapView                    locationEnabled = { true }                    showsCompass = { true }                    showsScale = { true }                    userTrackingMode = {'follow'}                    zoomLevel = { 17 }                    style = {{flex: 1}}                    onLongPress={this._longPressEvent}                    onLocation = {this._locationEvent}                >                    {this.state.showMark ? this._showMarker() : <View/>}                    {this.state.showDrive ? this._showDrive() : <View/>}                </MapView>                <TouchableWithoutFeedback onPress={() => this._pressEvent()}>                    <View style={styles.bottomtitle}>                        <Text>{this.state.address}</Text>                    </View>                </TouchableWithoutFeedback>                <TouchableWithoutFeedback onPress={() => this._changeRoad1()}>                    <View style={styles.topTitle1}>                        <Text>切换路线1</Text>                    </View>                </TouchableWithoutFeedback>                <TouchableWithoutFeedback onPress={() => this._changeRoad2()}>                    <View style={[styles.topTitle1, styles.topTitle2]}>                        <Text>切换路线2</Text>                    </View>                </TouchableWithoutFeedback>                <TouchableWithoutFeedback onPress={() => this._changeRoad3()}>                    <View style={[styles.topTitle1, styles.topTitle3]}>                        <Text>切换路线3</Text>                    </View>                </TouchableWithoutFeedback>                <View style={[styles.topTitle1, {top:150}]}>                    <Text>总共线路:</Text>                    <Text>                        { this.state.total}                    </Text>                </View>            </View>        )    }    _showMarker = () => {        return <Marker draggable = {false}                       clickable = {false}                       coordinate={this.state.coordinates}        />    }    _showDrive = () => {        return <PlanDrive strategy={11}                          showImgRoad={true}                          nonColor={'#FFFF68F'}                          clearColor={'#FFC1C1'}                          slowColor={'#FF6EB4'}                          busyColor={'#DBDBDB'}                          coordinates={[this.state.locationCoor, this.state.coordinates]}                          onStatusPlanComplete = {this._showPlanRoad}                          ref={ref => this.planDrive = ref}        />    }    _showPlanRoad = ({nativeEvent}) => {        console.log(nativeEvent)        this.setState({            total:Object.keys(nativeEvent).length-1        })    }    _longPressEvent = ({nativeEvent}) => {        let self = this        let coordinates = {latitude: nativeEvent.latitude, longitude: nativeEvent.longitude}        MapSearch.searchLocation(coordinates)            .then(dic => self.setState({coordinates: coordinates,address: dic.formattedAddress,showMark: true}),                err => console.log('err'))    }    _locationEvent = ({nativeEvent}) => {        if (this.state.locationCoor.latitude === 0) {            this.setState({                locationCoor:{latitude:nativeEvent.latitude, longitude:nativeEvent.longitude}            })        }    }    _pressEvent = () => {        this.setState({            showDrive: true        })    }    _changeRoad1 = () => {        this.planDrive && (this.planDrive.changePlanRoad({choice: 0}))    }    _changeRoad2 = () => {        this.planDrive && (this.planDrive.changePlanRoad({choice: 1}))    }    _changeRoad3 = () => {        this.planDrive && (this.planDrive.changePlanRoad({choice: 2}))    }}const styles = StyleSheet.create({    bottomtitle: {        position: 'absolute',        width: screenWidth,        height: 40,        bottom: 10,        backgroundColor: 'white'    },    topTitle1: {        position: 'absolute',        width: 60,        height: 40,        top: 60,        left: 10,        backgroundColor: 'red'    },    topTitle2: {        left: 100    },    topTitle3: {        left: 180    }})