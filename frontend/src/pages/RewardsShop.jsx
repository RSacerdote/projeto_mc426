import React, { useState, useEffect, useRef } from 'react';
import './RewardsShop.css';

const initialTasks = [
  { id: 1, name: 'Pedalar 5km', points: 50, completed: false },
  { id: 2, name: 'Usar a ciclofaixa da Unicamp', points: 30, completed: false },
  { id: 3, name: 'Registrar 3 viagens de bike', points: 70, completed: false },
  { id: 4, name: 'Participar de evento de ciclismo', points: 100, completed: false },
];

const initialRewards = [
  { id: 101, name: 'Adesivo Exclusivo', cost: 20 },
  { id: 102, name: 'Garrafa de Água', cost: 50 },
  { id: 103, name: 'Desconto em Loja Parceira', cost: 100 },
  { id: 104, name: 'Sorteio Mensal', cost: 150 },
];

function RewardsShop() {
  const [tasks, setTasks] = useState(initialTasks);
  const [rewards, setRewards] = useState(initialRewards);
  const [userPoints, setUserPoints] = useState(0);

  const isUpdatingPoints = useRef(false); 

  useEffect(() => {}, [userPoints]);

  const toggleTaskCompletion = (taskId) => {
    if (isUpdatingPoints.current) {
        return;
    }
    isUpdatingPoints.current = true; 

    const taskToToggle = tasks.find(task => task.id === taskId);
    if (!taskToToggle) return;

    const newCompleted = !taskToToggle.completed;

    setUserPoints(prevPoints => {
    const pointsChange = newCompleted ? taskToToggle.points : -taskToToggle.points;
    return prevPoints + pointsChange;
    });

    setTasks(prevTasks =>
    prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: newCompleted } : task
    )
    );

    setTimeout(() => {
        isUpdatingPoints.current = false;
    }, 100); 
  };

  const buyReward = (rewardId) => {
    if (isUpdatingPoints.current) {
        return;
    }
    isUpdatingPoints.current = true;

    const rewardToBuy = rewards.find(r => r.id === rewardId);
    if (rewardToBuy && userPoints >= rewardToBuy.cost) {
      setUserPoints(prevPoints => prevPoints - rewardToBuy.cost);
      alert(`Você comprou: ${rewardToBuy.name}! Pontos restantes: ${userPoints - rewardToBuy.cost}`);
      setRewards(prevRewards => prevRewards.filter(r => r.id !== rewardId));
    } else if (rewardToBuy) {
      alert(`Pontos insuficientes para comprar ${rewardToBuy.name}. Você tem ${userPoints} pontos, mas precisa de ${rewardToBuy.cost}.`);
    }
    setTimeout(() => {
        isUpdatingPoints.current = false;
    }, 100);
  };

  return (
    <div className="rewards-shop-container">
      <h2>Loja de Recompensas</h2>
      <p className="user-points">Seus Pontos: <strong>{userPoints}</strong></p>

      <section className="tasks-section">
        <h3>Tarefas</h3>
        <div className="card-grid">
          {tasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed-task-card' : ''}`}>
              <h4>{task.name}</h4>
              <p>+{task.points} pontos</p>
              <button onClick={(e) => {
                  toggleTaskCompletion(task.id);
              }}
                disabled={task.completed}>
                {task.completed ? 'Concluída' : 'Concluir'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rewards-section">
        <h3>Recompensas</h3>
        <div className="card-grid">
          {rewards.map(reward => (
            <div key={reward.id} className="reward-card">
              <h4>{reward.name}</h4>
              <p>{reward.cost} pontos</p>
              <button onClick={(e) => {
                  buyReward(reward.id);
              }} disabled={userPoints < reward.cost}>
                Comprar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RewardsShop;