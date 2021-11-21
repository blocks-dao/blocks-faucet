import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
const logo = "../../assets/blocks.png"
declare const window: any;

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>
            <img className="logo" src={logo} />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color="dark">
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
