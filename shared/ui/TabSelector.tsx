import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

interface BytebankTabSelectorProps {
    tabs: Array<{ name: string, label: string }>,
    activeTab: string,
    onTabChange: (name: string) => void,
}
export function BytebankTabSelector({ tabs, activeTab, onTabChange }: BytebankTabSelectorProps) {
    return (
        <View style={styles.tabSelector}>
            {
                tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.name}
                        style={[styles.tabButton, activeTab === tab.name && styles.tabActive]}
                        onPress={() => onTabChange(tab.name)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.name && styles.tabTextActive]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))
            }</View>

    );
}

const styles = StyleSheet.create({
    tabSelector: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 50,
        padding: 5,
        width: '100%',
        marginBottom: 30,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    tabTextActive: {
        color: '#000',
    },
});