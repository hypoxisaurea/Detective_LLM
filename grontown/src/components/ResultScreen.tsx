import {
    AspectRatio,
    Center,
    Heading,
    Text,
    HStack,
    Button,
    VStack,
    Box,
    Spacer,
} from "@chakra-ui/react";
import {
    getGameState,
    resetGameState,
    saveGameState,
} from "rpg/data/persistence";
import CroppedImage from "./util/CroppedImage";
import {EnglishToKorean} from "./util/Korean";

export enum GameResult {
    WIN,
    LOSS,
    DEAD,
}

export interface ResultScreenProps {
    status: GameResult;
    suspect?: string;
    score?: number;
}

const ResultScreen = (props: ResultScreenProps) => {
    let title, text, imgSrc;
    switch (props.status) {
        case GameResult.WIN:
            switch (props.score) {
                case 1:
                    title = "헉! 간신히 잡았네요!";
                    text = `와우, 정의의 손길이 겨우 닿았습니다! 용의자를 잡고 보니 범인이 자백은 했는데, 
            여러분의 추리력은 좀 많이 빗나갔군요. 프로메테우스 경찰서에서 이번 사건 해결에 대해 1점을 주셨어요. 
            음... 탐정 일은 취미로 하시는 게 어떨까요?`;
                    break;
                case 2:
                    title = "오! 운이 좋으셨군요!";
                    text = `정의가 이루어졌습니다... 그냥저냥요. 용의자를 잡아 자백까지 받아냈지만, 
            여러분의 추리는 진실과는 좀 거리가 있었어요. 프로메테우스 경찰서에서 이번 사건에 대해 2점을 주셨네요. 
            탐정 뱃지는 받으셨지만, 아직 연마할 길이 멀어 보입니다!`;
                    break;
                case 3:
                    title = "꽤나 괜찮은데요?";
                    text = `정의의 포획 작전 성공! 용의자를 잡고 보니 범인이 자백을 툭 하고 뱉더라고요. 
            여러분의 추리가 꽤 정확했네요! 프로메테우스 경찰서에서 이번 사건 해결에 대해 3점을 주셨어요. 
            완벽한 탐정은 아니어도 꽤나 괜찮은 실력이군요!`;
                    break;
                case 4:
                    title = "와우! 거의 완벽했어요!";
                    text = `정의가 승리했습니다! 용의자를 체포하자마자 범인이 주저 없이 자백했어요. 
            여러분의 추리가 거의 진실에 맞아떨어졌죠! 프로메테우스 경찰서에서 이번 사건 해결에 대해 4점을 주셨습니다. 
            셜록 홈즈도 울고 갈 실력이네요!`;
                    break;
                case 5:
                    title = "천재 탐정이시군요!";
                    text = `완벽한 정의의 구현! 용의자를 체포하자 범인이 얼떨떨한 표정으로 자백했어요. 
            여러분의 추리가 정확히 진실을 꿰뚫었습니다! 프로메테우스 경찰서에서 이번 사건 해결에 대해 만점인 5점을 주셨어요. 
            혹시 탐정 소설 쓸 생각 없으세요? 대박 날 것 같은데요!`;
                    break;
            }
            imgSrc = "/assets/web/justice.jpeg";
            break;
        case GameResult.DEAD:
            // TODO: 이 부분 수정 필요
            title = "아야야! 박살났네요!";
            text = `우아한 신사 윌리엄 해링턴 씨가 당신의 무례한 행동에 깊은 분노를 느꼈답니다. 
    결국 그의 신사적인(!) 주먹맛을 온몸으로 체험하셨네요. 물론 그는 아무 벌도 받지 않았어요. 
    앞으로 그는 당신을 '투명인간' 취급할 예정입니다. 축하해요, 이제 당신은 해링턴 씨에게 안 보이는 사람이에요!`;
            imgSrc = "/assets/web/hospital.jpeg";
            // TODO: fix hardcode string
            getGameState().nonInteractableNpcs.add("William Harrington");
            saveGameState();
            break;

        case GameResult.LOSS:
            title = "이런 웬일이래요!";
            const suspect = EnglishToKorean(props.suspect!);
            text = `${suspect}(이)가 전기의자의 '짜릿한' 맛을 보게 되었어요. 하지만 그(그녀)는 
    끝까지 결백을 주장했답니다. 뭔가 찜찜한 기분이 드네요. 설마... 진짜 범인이 아직 멀쩡히 
    돌아다니고 있는 건 아니겠죠? 어, 이런! 탐정님, 이거 대형 사고의 냄새가?!`;
            imgSrc = "/assets/web/electric_chair.jpeg";
            getGameState().goneNpcs.add(props.suspect!);
            saveGameState();
            break;
    }

    const newGame = () => {
        resetGameState();
        window.location.reload();
    };

    const continueGame = () => {
        window.location.reload();
    };

    return (
        <Box width={"100vw"} height={"100vh"}>
            <Center width={"100%"} height={"100%"}>
                <VStack gap={15}>
                    <Heading size={"4xl"}>{title}</Heading>
                    <AspectRatio width={"60vh"} maxW={"1024px"} ratio={1 / 1}>
                        <CroppedImage imgSrc={imgSrc}></CroppedImage>
                    </AspectRatio>
                    <Text width={"50%"} fontSize={"xl"}>
                        {text}
                    </Text>
                    {props.status === GameResult.WIN && (
                        <HStack>
                            <Button colorScheme="green" onClick={newGame}>
                                New Game
                            </Button>
                        </HStack>
                    )}
                    {props.status === GameResult.DEAD && (
                        <HStack>
                            <Button colorScheme="red" onClick={newGame}>
                                New Game
                            </Button>
                            <Spacer width={"30%"}/>
                            <Button colorScheme="teal" onClick={continueGame}>
                                Leave the Hospital and Continue
                            </Button>
                        </HStack>
                    )}
                    {props.status === GameResult.LOSS && (
                        <HStack>
                            <Button colorScheme="red" onClick={newGame}>
                                New Game
                            </Button>
                            <Spacer width={"30%"}/>
                            <Button colorScheme="teal" onClick={continueGame}>
                                Continue the Investigation
                            </Button>
                        </HStack>
                    )}
                </VStack>
            </Center>
        </Box>
    );
};

export default ResultScreen;
