# cleveland_bnn.py
# CNTK 2.3 with Anaconda 4.1.1 (Python 3.5, NumPy 1.11.1)

import numpy as np
import cntk as C

def create_reader(path, input_dim, output_dim, rnd_order, sweeps):
  x_strm = C.io.StreamDef(field='symptoms', shape=input_dim,
   is_sparse=False)
  y_strm = C.io.StreamDef(field='disease', shape=output_dim,
    is_sparse=False)
  streams = C.io.StreamDefs(x_src=x_strm, y_src=y_strm)
  deserial = C.io.CTFDeserializer(path, streams)
  mb_src = C.io.MinibatchSource(deserial, randomize=rnd_order, \
    max_sweeps=sweeps)
  return mb_src

# ===================================================================

def main():
  print("\nBegin binary classification (two-node technique) \n")
  print("Using CNTK version = " + str(C.__version__) + "\n")

  input_dim = 18
  hidden_dim = 20
  output_dim = 2

  train_file = ".\\Data\\cleveland_cntk_twonode.txt"
  
  # 1. create network
  X = C.ops.input_variable(input_dim, np.float32)
  Y = C.ops.input_variable(output_dim, np.float32)

  print("Creating a 18-20-2 tanh-softmax NN ") 
  with C.layers.default_options(init=C.initializer.uniform(scale=0.01,\
    seed=1)):
    hLayer = C.layers.Dense(hidden_dim, activation=C.ops.tanh,
      name='hidLayer')(X)  
    oLayer = C.layers.Dense(output_dim, activation=None,
     name='outLayer')(hLayer)
  nnet = oLayer
  model = C.ops.softmax(nnet)

  # 2. create learner and trainer
  print("Creating a cross entropy batch=10 SGD LR=0.005 Trainer ")
  tr_loss = C.cross_entropy_with_softmax(nnet, Y)
  tr_clas = C.classification_error(nnet, Y)
 
  max_iter = 5000 
  batch_size = 10 
  learn_rate = 0.005 
  learner = C.sgd(nnet.parameters, learn_rate)
  trainer = C.Trainer(nnet, (tr_loss, tr_clas), [learner])

  # 3. create reader for train data
  rdr = create_reader(train_file, input_dim, output_dim,
    rnd_order=True, sweeps=C.io.INFINITELY_REPEAT)
  heart_input_map = {
    X : rdr.streams.x_src,
    Y : rdr.streams.y_src
  }

  # 4. train
  print("\nStarting training \n")
  for i in range(0, max_iter):
    curr_batch = rdr.next_minibatch(batch_size, \
      input_map=heart_input_map)
    trainer.train_minibatch(curr_batch)
    if i % int(max_iter/10) == 0:
      mcee = trainer.previous_minibatch_loss_average
      macc = (1.0 - trainer.previous_minibatch_evaluation_average) \
        * 100
      print("batch %4d: mean loss = %0.4f, accuracy = %0.2f%% " \
        % (i, mcee, macc))
  print("\nTraining complete")

  # 5. evaluate model using all data
  print("\nEvaluating accuracy using built-in test_minibatch() \n")
  rdr = create_reader(train_file, input_dim, output_dim,
    rnd_order=False, sweeps=1)
  heart_input_map = {
    X : rdr.streams.x_src,
    Y : rdr.streams.y_src
  }
  num_test = 297
  all_test = rdr.next_minibatch(num_test, input_map=heart_input_map) 
  acc = (1.0 - trainer.test_minibatch(all_test)) * 100
  print("Classification accuracy on the %d data items = %0.2f%%" \
    % (num_test,acc))

  # (could save model here)

  # (use trained model to make prediction)

  print("\nEnd Cleveland Heart Disease classification ")

# ===================================================================
   
if __name__ == "__main__":
  main()
