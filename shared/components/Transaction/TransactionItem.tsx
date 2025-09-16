import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
import { TransactionItemProps } from "../../classes/models/transaction";

export const TransactionItem = ({transaction}: {transaction: TransactionItemProps}) => (
    <View style={styles.itemContainer}>
        <View style={{ backgroundColor: transaction.type === 'income' ? '#eef4ce' : '#ffe7e7', ...styles.itemIconContainer }}>
            <Ionicons
                name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                size={30}
                color={'#333'}
            />
        </View>
        <View style={styles.itemDetalhes}>
            <Text style={styles.itemtitle}>{transaction.title}</Text>
            <Text style={styles.itemDescription}>{transaction.description}</Text>
        </View>
        <View style={styles.itemValueContainer}>
            <Text style={[styles.itemValue]}>
                {transaction.value}
            </Text>
            <Text style={styles.itemData}>{transaction.createdAt}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 0,
        marginTop: 20
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemIconContainer: {
        marginRight: 12,
        borderRadius: 25,
        padding: 10,
    },
    itemDetalhes: {
        flex: 1,
    },
    itemtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDescription: {
        fontSize: 14,
        color: '#888',
    },
    itemValueContainer: {
        alignItems: 'flex-end',
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemData: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});