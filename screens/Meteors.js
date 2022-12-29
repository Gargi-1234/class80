import React, { Component } from 'react';
import { FlatList, SafeAreaView, Text, View, ImageBackground, Image } from 'react-native';
import axios from "axios";

export default class MeteorScreen extends Component {
    constructor() {
        super();
        this.state = {
            meteors: {}
        }
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=H2yJuB6bBfyt3X38AXgNfFRBt2fDLdadYJ8ZZY8L")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }
    componentDidMount() {
        this.getMeteors()
    }
    keyExtractor = (item, index) => {
        index.toString()
    }
    renderItem = (item) => {
        let meteor = item
        let bg_img, speed, size
        if (meteor.threat_score <= 30) {
            bg_img = require("../assets/meteor_bg1.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 100
        }
        else if (meteor.threat_score <= 75) {
            bg_img = require("../assets/meteor_bg2.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 150
        }
        else {
            bg_img = require("../assets/meteor_bg3.png")
            speed = require("../assets/meteor_speed3.gif")
            size = 200
        }
        return (
            <View>
                <ImageBackground source={bg_img} style={styles.backgroundImage} >
                    <View style={styles.gifContainer}>
                        <Image source={speed} style={{ width: size, height: size, alignSelf: "center" }} >
                        </Image>
                    </View>
                    <Text style={[styles.cardTitle, { marginTop: 400, marginLeft: 50 }]} >
                        {item.name}
                    </Text>
                    <Text style >
                        Closest to Earth{item.close_approach_data[0].close_approach_date_full}
                    </Text>
                    <Text  >
                        minimum diameter{item.estimated_diameter.kilometers.estimated_diameter_min}
                    </Text>
                    <Text  >
                        maximun diameter{item.estimated_diameter.kilometers.estimated_diameter_max}
                    </Text>
                    <Text  >
                        missing Earth by{item.close_approach_data[0].miss_distance.kilometers}
                    </Text>
                    <Text  >
                        Velocity{item.close_approach_data[0].relative_velocity.kilometers_per_hour}
                    </Text>

                </ImageBackground>
            </View>
        )
    }
    render() {
        if (Object.keys(this.state.location).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor__arr = Object.keys(this.state.meteors).map((meteor_date) => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor__arr)
            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore
            })
            meteors.sort(function (a, b) {
                return b.threat_score - a.threat_score
            })
            meteors = meteors.slice(0, 5)
            return (
                <View style={styles.container} >
                    <SafeAreaView style={styles.droidSafeArea} />
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={meteors}
                        renderItem={this.renderItem}
                        horizontal={true}
                    />

                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    cardTitle: { fontSize: 20, marginBottom: 10, fontWeight: "bold", color: "white" }, 
    cardText: { color: "white" }, threatDetector: { height: 10, marginBottom: 10 }, gifContainer: { justifyContent: "center", alignItems: "center", flex: 1 },
})