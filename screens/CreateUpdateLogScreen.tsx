import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { View, Pressable, TextInput, Text } from 'react-native'
import { RootStackParamList } from '../navigation/stack'
import { LogProperty } from '../services/BlastroRepoService'

type Props = NativeStackScreenProps<RootStackParamList, 'create-update-log'>

export default function CreateUpdateLogScreen({ route, navigation }: Props) {
  const blastroLog = route.params.blastroLog

  useEffect(() => {
    navigation.setOptions({ title: `new ${blastroLog.title}` })
  }, [blastroLog.title])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 18 }}>
        <View style={{ flexDirection: 'row' }}>
          {blastroLog.properties.map((p) => (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: 'lightgray',
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 4,
                flexDirection: 'row'
              }}
              key={`prop-${p.name}`}
            >
              <Text style={{ color: 'gray' }}>{p.name}</Text>
              {p.defaultValue && (
                <Text style={{ paddingLeft: 8 }}>
                  {evaluateValue('date', p.defaultValue).toDateString()}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
        <View
          style={{
            paddingVertical: 8
          }}
        >
          <TextInput
            style={{
              paddingVertical: 8,
              fontSize: 20
            }}
            placeholder="body"
            multiline
          />
        </View>
      </View>
    </View>
  )
}

type Value<T extends LogProperty['type']> = T extends 'date'
  ? Date
  : T extends 'string'
  ? string
  : number

const evaluateValue = <T extends LogProperty['type'] = 'date'>(
  type: T,
  value: string
): Value<T> => {
  switch (type) {
    case 'date':
      return (value === 'now()' ? new Date() : new Date(value)) as Value<T>

    default:
      return value as Value<T>
  }
}
